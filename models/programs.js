const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var programSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    personalCode:  {
        type: String, //mby try Number in the future
        required: true
    },
    programStatus:  {
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

var Programs = mongoose.model('Program', programSchema);

module.exports = Programs;