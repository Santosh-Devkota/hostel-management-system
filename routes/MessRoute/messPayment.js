const express = require("express");
const Router = express.Router()
const {addNewPayment,
    findPayment,
    updatePayment,
    deletePaymentById} = require("../../controller/Mess/messPayment");

Router.post("/mess/payment/addnew",addNewPayment);
Router.get("/mess/payment/findpayment",findPayment);
Router.put("/mess/payment/updatepayment",updatePayment);
Router.delete("/mess/payment/delete/:id",deletePaymentById);

module.exports = Router