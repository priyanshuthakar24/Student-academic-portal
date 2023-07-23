const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminschema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileno:{
        type:Number,
        required:true
    },
    indexno:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('Admin', adminschema);