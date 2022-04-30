const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var exerciseSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    ytLink:  {
        type: String,
        required: true
    },
    difficulty:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    }
}, {
    timestamps: true
});

var Exercises = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercises;

// {
//     "name": "Alkunė į viršų",
//     "ytLink": "391091https://www.youtube.com/watch?v=rwCJvSKzQkc&t9988",
//     "difficulty": "3",
//     "comment": "3 kartus po 12 su 45 sekundžių pertrauką",
//     "program": "626c28795f305d28b47b72ef"
// }