import React, { useState, useEffect } from 'react'
import { Edit, Delete, Add } from '@mui/icons-material';
import { postData, editData, deleteData, fetchDataFromApi } from '../../utils/api';
import PayOSPayment from '../Payment/PayOSPayment';
import { Link } from 'react-router-dom';
import { TextField, MenuItem, FormControlLabel, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Card, CardContent, Typography, Box, Radio, RadioGroup } from '@mui/material';
import { useContext } from 'react';
import { MyContext } from '../../context/MyConext';


const AddressManage = () => {
    const context = useContext(MyContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [addresses, setAddresses] = useState([]);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingAddressId, setDeletingAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        city: '',
        details: '',
        moreInfo: ''
    });

    // Fetch addresses when component mounts
    useEffect(() => {
        if (user?.userId) {
            fetchAddresses();
        }
    }, [user?.userId]);

    const fetchAddresses = async () => {
        try {
            const response = await fetchDataFromApi(`/api/address/user/${user.userId}`);
            setAddresses(response);
            // Set selected address to default address if exists
            const defaultAddress = response.find(addr => addr.isDefault);
            if (defaultAddress) {
                context.setSelectedAddressId(defaultAddress._id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };



    //Processing adding new address
    const handleAddAddress = async () => {
        try {
            if (!newAddress.city || !newAddress.details) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Please fill in the full address information",
                });
                return;
            }

            const response = await postData(`/api/address`, {
                userId: user.userId,
                ...newAddress
            });

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "An error occurred while adding the address",
                });
                return;
            }

            await fetchAddresses();
            setNewAddress({ city: '', details: '', moreInfo: '' });
            setShowAddAddressModal(false);
            context.setAlterBox({
                open: true,
                error: false,
                message: "Address added successfully!",
            });
        } catch (error) {
            console.error('Error adding address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "An error occurred while adding the address",
            });
        }
    };

    //Processing address edit
    const handleEditAddress = async () => {
        try {
            if (!editingAddress.city || !editingAddress.details) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Please fill in the full address information",
                });
                return;
            }

            const response = await editData(`/api/address/${editingAddress._id}`, {
                city: editingAddress.city,
                details: editingAddress.details,
                moreInfo: editingAddress.moreInfo
            });

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "An error occurred while editing the address",
                });
                return;
            }

            await fetchAddresses();
            setShowEditAddressModal(false);
            setEditingAddress(null);
            context.setAlterBox({
                open: true,
                error: false,
                message: "Address updated successfully!",
            });
        } catch (error) {
            console.error('Error editing address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "An error occurred while editing the address",
            });
        }
    };

    //Show delete confirmation dialog
    const showDeleteConfirmation = (addressId) => {
        setDeletingAddressId(addressId);
        setShowDeleteConfirmModal(true);
    };

    //Processing address deletion
    const handleDeleteAddress = async () => {
        try {
            const response = await deleteData(`/api/address/${deletingAddressId}`);

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: response.notify || response.message || "An error occurred while deleting the address",
                });
                return;
            }

            await fetchAddresses();
            if (context.selectedAddressId === deletingAddressId) {
                context.setSelectedAddressId('');
            }
            setShowDeleteConfirmModal(false);
            setDeletingAddressId(null);
            context.setAlterBox({
                open: true,
                error: false,
                message: "Address deleted successfully!",
            });
        } catch (error) {
            console.error('Error deleting address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "An error occurred while deleting the address",
            });
        }
    };

    //Processing default address setting
    const handleSetDefaultAddress = async (addressId) => {
        try {
            const response = await editData(`/api/address/${addressId}/set-default`);

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: response.notify || response.message || "An error occurred while setting the default address",
                });
                return;
            }

            await fetchAddresseAddress listh (error) {
            console.error('Error setting default address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "An error occurred while setting the default address",
            });
        }
    };

    return (
        <div className="checkout-single boxshado-single">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4>Shipping address</h4>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowAddAddressModal(true)}
                    style={{ backgroundColor: '#28a745' }}
                >Add address</Button>
            </div>{/* Address list */}<RadioGroup value={context.selectedAddressId} onChange={(e) => context.setSelectedAddressId(e.target.value)}>
                {addresses.length > 0 ? (
                    addresses.map((addr) => (
                        <Card key={addr._id} style={{ marginBottom: '10px', border: context.selectedAddressId === addr._id ? '2px solid #007bff' : '1px solid #ddd' }}>
                            <CardContent style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                                        <Radio value={addr._id} />
                                        <div style={{ marginLeft: '10px' }}>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                {addr.city}
                                                {addr.isDefault && (
                                                    <span style={{ marginLeft: '10px', color: '#28a745', fontSize: '0.8em' }}>(Default)</span>
                                                )}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {addr.details}
                                            </Typography>
                                            {addr.moreInfo && (
                                                <Typography variant="body2" color="textSecondary">
                                                    {addr.moreInfo}
                                                </Typography>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {!addr.isDefault && (
                                            <Button
                                                size="small"
                                                onClick={() => handleSetDefaultAddress(addr._id)}
                                                style={{ marginRight: '10px' }}
                                            >Set as default</Button>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setEditingAddress(addr);
                                                setShowEditAddressModal(true);
                                            }}
                                            style={{ marginRight: '5px' }}
       Add address modal             >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => showDeleteConfirmation(addr._id)}
                                            color="error"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', padding: '20px' }}>No addresses found. Please add a delivery address.</Typography>
                )}
            </RadioGroup>{/* Add address modal */}<Dialog open={showAddAddressModal} onClose={() => setShowAddAddressModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add new address</DialogTitle>
                <DialogContent>
                    <div style={{ paddingTop: '10px' }}>
                        <TextField
                            fullWidth
                            label="Province/City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
              Edit address modal="Detailed address"
                            value={newAddress.details}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, details: e.target.value }))}
                            margin="normal"
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Thông tin bổ sung"
                            value={newAddress.moreInfo}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, moreInfo: e.target.value }))}
                            margin="normal"
                            multiline
                            rows={2}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddAddressModal(false)}>Cancel</Button>
                    <Button onClick={handleAddAddress} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>{/* Edit address modal */}<Dialog open={showEditAddressModal} onClose={() => setShowEditAddressModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit address</DialogTitle>
                <DialogContent>
                    {editingAddress && (
                        <div style={{ paddingTop: '10px' }}>
                            <TextField
                                fullWidth
                                label="Province/City"
                                value={editingAddress.city}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, city: e.target.value }))}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Detailed address"
                                value={editingAddress.details}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, details: e.target.value }))}
                                margin="normal"
                                multiline
                                rows={3}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Thông tin bổ sung"
                                value={editingAddress.moreInfo || ''}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, moreInfo: e.target.value }))}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditAddressModal(false)}>Cancel</Button>
                    <Button onClick={handleEditAddress} variant="contained">Cập nhật</Button>
                </DialogActions>
            </Dialog>{/* Address deletion confirmation modal */}<Dialog open={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this address? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowDeleteConfirmModal(false);
                        setDeletingAddressId(null);
                    }}>Cancel</Button>
                    <Button onClick={handleDeleteAddress} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>


    )
}

export default AddressManage