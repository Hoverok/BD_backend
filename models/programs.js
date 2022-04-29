const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var programSchema = new Schema({
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

var Programs = mongoose.model('Program', programSchema);

module.exports = Programs;