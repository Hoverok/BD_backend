const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var patientSchema = new Schema({
    fullName:  {
        type: String,
        required: true
    },
    personalCode:  {
        type: String, //mby try Number in the future
        required: true
    },
    address:  {
        type: String,
        required: true
    },
    telNum: {
        type: String,
        required: true 
    },
    email : {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var Patients = mongoose.model('Patient', patientSchema);

module.exports = Patients;

// {
//     "fullName": "John Jameson",
//     "personalCode": "123456789",
//     "address": "Vilnius gabijos g-vė",
//     "telNum": "8654632135",
//     "email": "email@email.com"
// }