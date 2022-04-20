const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/movie", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once("open", function(){
    console.log("Mongodb connection established successfly");
})