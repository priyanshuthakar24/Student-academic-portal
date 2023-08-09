const mongoose = require('mongoose');
const filehelper = require('../util/fileunlink');
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
studentschema.methods.removefromCart = function (productId) {
    console.log("method call");
    const updatedCartItems = this.cart.items.filter(item => {
        console.log(item._id);
        return item._id.toString() !== productId.toString();
    });
    const unlik=this.cart.items.filter(item1=>{
        return item1._id.toString() === productId.toString();
    })
    console.log(unlik);
    filehelper.deleteFile(unlik[0].marksheet);
    this.cart.items = updatedCartItems;
    return this.save();
}
module.exports = mongoose.model('Students', studentschema);