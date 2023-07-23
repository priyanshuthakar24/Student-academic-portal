const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentschema = new Schema({
    name: {
        type: String,
        require: true
    },
    mobileno: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    adharno: {
        type: String,
        required: true
    },
    Dob: {
        type: String,
        required: true
    },
    xender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    cart: {
        items: [{
            marksheet: {
                type: String,
                required: true
            },
            std: {
                type: Number,
                required: true
            },
            result: {
                type: String,
                required: true
            }
        }]
    }
});
studentschema.statics.addtocart = function (items) {
    const marksheet = req.body.marksheetlink;
    const std = req.body.std;
    const result = req.body.result;
    const updatedCartItems = [...this.cart.items];
    updatedCartItems.push({ marksheet: marksheet, std: std, result: result });
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}
module.exports = mongoose.model('Students', studentschema);