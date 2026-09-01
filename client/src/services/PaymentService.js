import { fetchDataFromApi } from '../utils/api';

const CASSO_API_KEY = process.env.REACT_APP_CASSO_API_KEY;
const CASSO_API_URL = 'https://oauth.casso.vn/v2/transactions';

export const checkPaymentStatus = async (orderId, amount) => {
    try {
        const response = await fetch(CASSO_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': CASSO_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error !== 0) {
            throw new Error(data.message || 'API error');
        }

        //Find matching transaction
        const matchingTransaction = data.data.records.find(transaction => {
            //Check amount
            if (transaction.amount !== amount) {
                return false;
            }

            //Check if description contains orderId
            if (transaction.description && transaction.description.includes(orderId)) {
                return true;
            }

            //Check transaction time (within the last 24h)
            const transactionTime = new Date(transaction.when);
            const now = new Date();
            const timeDiff = now - transactionTime;
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                return false;
            }

            return false;
        });

        return {
            success: true,
            isPaid: !!matchingTransaction,
            transaction: matchingTransaction || null,
            message: matchingTransaction ? 'Thanh toán thành công' : 'Payment transaction not found'
        };

    } catch (error) {
        console.error('Error checking payment status:', error);
        return {
            success: false,
            isPaid: false,
            transaction: null,
            message: 'Error when checking payment status'
        };
    }
};

export const startPaymentMonitoring = (orderId, amount, onPaymentDetected) => {
    let intervalId;
    let checkCount = 0;
    const maxChecks = 10; //Check a maximum of 10 times (5 minutes with 30s interval)

    const checkPayment = async () => {
        checkCount++;

        const result = await checkPaymentStatus(orderId, amount);

        if (result.success && result.isPaid) {
            clearInterval(intervalId);
            onPaymentDetected(result.transaction);
            return;
        }

        if (checkCount >= maxChecks) {
            clearInterval(intervalId);
            console.log('Payment monitoring timeout');
        }
    };

    //Start checking immediately
    checkPayment();

    //Then check every 30 seconds
    intervalId = setInterval(checkPayment, 30000);

    //Return the function to stop monitoring
    return () => {
        clearInterval(intervalId);
    };
}; 