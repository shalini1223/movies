const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    director: {
        type: String,
        required: true
    },
    imdb_rating: {
        type: Number,
        required: true
    },
    poster: {
        type: String,
        required: true        
    },
    length: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    genres: {
        type:String,
        required: true
    }
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;