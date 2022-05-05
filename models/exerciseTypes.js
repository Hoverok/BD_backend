const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var exerciseTypeSchema = new Schema({
    ytLink:  {
        type: String,
        required: true
    },
    title:  {
        type: String,
        required: true
    },
    intensity:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    inventory:  {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

var ExerciseTypes = mongoose.model('ExerciseType', exerciseTypeSchema);

module.exports = ExerciseTypes;


// {
//     "ytLink": "https://www.youtube.com/watch?v=ouncVBiye_M",
//     "title": "į viršu",
//     "intensity": "3",
//     "inventory": "Lazda"
// }