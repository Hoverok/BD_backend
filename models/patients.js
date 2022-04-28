const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var patientSchema = new Schema({
    name:  {
        type: String,
        required: true
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