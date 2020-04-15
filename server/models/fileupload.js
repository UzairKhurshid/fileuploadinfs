const mongoose = require('mongoose')

const fileuploadSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    filepath: {
        type: String,
        required: true
    }

});


const fileUpload = mongoose.model('fileUpload', fileuploadSchema)
module.exports = fileUpload