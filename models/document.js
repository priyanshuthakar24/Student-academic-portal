const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const documentschema = new Schema({
    name: {
        type: String,
        required: true
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
    documenttype: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
})
module.exports = mongoose.model('Document', documentschema);