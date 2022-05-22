const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var programSchema = new Schema({
    description:  {
        type: String,
        required: true
    },
    duration:  {
        type: Number
    },
    requirements:  {
        type: String, 
        default: ''
    },
    programStatus:  {
        type: String, 
        default: ''
    },
    startDate: {
        type:Date
    },
    endDate: {
        type:Date
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
}, {
    timestamps: true
});

var Programs = mongoose.model('Program', programSchema);

module.exports = Programs;

//6270e3cfeda0703bec60deb2
//"personalCode": "123456789",