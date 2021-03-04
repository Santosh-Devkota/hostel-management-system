const express = require("express");
const Router = express.Router()
const {makeNewPayment,
    findPaymentHistory,
    getCurrentStatus,
    // updateCurrentPaymentRecord,
    deletePaymentRecord
    } = require("../../controller/Mess/payment");


Router.get("/mess/payment/findhistory",findPaymentHistory);
Router.put("/mess/payment/makepayment",makeNewPayment);
Router.get("/mess/payment/currentstatus/:id",getCurrentStatus);
// Router.put("/mess/payment/updaterecord",updateCurrentPaymentRecord);
Router.delete("/mess/payment/delete/:id",deletePaymentRecord);

module.exports = Router

