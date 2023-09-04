// var instance = new Razorpay({ key_id: rzp_test_7kdoBr9Jk8LB4t, key_secret: PngTZdm0dQ4ExuCFEZYAKQNU });
const Razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config(); //env file requiring

var instance = new Razorpay({
  key_id: process.env.RAZOR_KEYID,
  key_secret:process.env.RAZOR_SECRET
});

module.exports = {
  initiateRazorpay: async (orderId, amount) => {
    value = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "" + orderId,
      notes: {
        key1: "value3",
        key2: "value2",
      },
    });
    return value;
  },

  validate: async (razorData) => {
    console.log("9");
    console.log(razorData);
    const paymentId = razorData["razorResponse[razorpay_payment_id]"];
    const orderId = razorData["razorResponse[razorpay_order_id]"];
    const signature = razorData["razorResponse[razorpay_signature]"];
    let hmac = crypto.createHmac("sha256", "PngTZdm0dQ4ExuCFEZYAKQNU"); //hash key creating
    await hmac.update(orderId + "|" + paymentId); //orderid+paymentid+key(only in server) is matched with signature
    hmac = await hmac.digest("hex");
    if (hmac == signature) return (orderConfirmed = true);
    return (orderConfirmed = false);
  },
};