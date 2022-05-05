const mongoose = require('mongoose');
const ExerciseTypes = require('./exerciseTypes');
const Schema = mongoose.Schema;

var exerciseSchema = new Schema({
    instuructions:  {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    },
    exerciseType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExerciseType'
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