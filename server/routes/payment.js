const express = require("express");
const fs = require("fs");
const path = require("path");
const qs = require("qs");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { Orders } = require("../models/orders");
const router = express.Router();

// --- VNPAY ---
//Read configuration from JSON
const configPath = path.join(__dirname, "../config/vnpay.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

//Function to sort Object by key order
function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach(key => { sorted[key] = obj[key]; });
    return sorted;
}

//API to create payment URL
router.post("/create_payment_url", (req, res) => {
    try {
        const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        const { amount, bankCode, orderDescription, orderType, language } = req.body;

        //Check input data
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        if (!orderDescription || typeof orderDescription !== "string") {
            return res.status(400).json({ message: "Invalid order description" });
        }

        const createDate = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
        const orderId = uuidv4().replace(/-/g, "").substring(0, 10);
        const locale = language || "vn";

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: config.vnp_TmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: "VND",
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderDescription,
            vnp_OrderType: orderType,
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: config.vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        if (bankCode) vnp_Params["vnp_BankCode"] = bankCode;

        //Sort and create signature
        const sortedParams = sortObject(vnp_Params);
        const signData = new URLSearchParams(sortedParams).toString(); //Replace qs.stringify()

        const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        vnp_Params["vnp_SecureHash"] = signed;
        const paymentUrl = `${config.vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`;

        res.json({ orderId, paymentUrl, createDate });

    } catch (error) {
        console.error("Payment URL creation error:", error);
        res.status(500).json({ message: "System error" });
    }
});

//Process transaction result
router.get("/vnpay_return", (req, res) => {
    try {
        const vnp_Params = { ...req.query };
        const secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        //Sort and regenerate signature
        const sortedParams = sortObject(vnp_Params);
        const signData = new URLSearchParams(sortedParams).toString(); //Replace qs.stringify()

        const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            const isSuccess = vnp_Params["vnp_ResponseCode"] === "00";
            res.json({
                message: isSuccess ? "Transaction successful" : "Transaction failed",
                status: isSuccess ? "success" : "failed",
                data: vnp_Params,
            });
        } else {
            res.status(400).json({ message: "Invalid signature", status: "error" });
        }
    } catch (error) {
        console.error("Result processing error:", error);
        res.status(500).json({ message: "System error" });
    }
});

module.exports = router;