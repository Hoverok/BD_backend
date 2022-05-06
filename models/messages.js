const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var messageSchema = new Schema({
    message:  {
        type: String,
        required: true
    },
    messageSeen: {
        type: Boolean,
        default: false
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    }
}, {
    timestamps: true
});

var Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;

// {
//     "message": "Message to the program",
//     "program": "6274ec12d99b140704ba33c1"
// }