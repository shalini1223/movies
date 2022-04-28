require("./db/mongoose");
require("dotenv/config");

const express = require('express')
const app = express()

const morgan = require('morgan');
const bodyparser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const port = process.env.PORT;

const Movie = require("./model/movie");
const Admin = require("./model/admin");
const auth = require("./middleware/auth");

app.use(morgan('tiny'));//morgan usage
app.use(bodyparser.urlencoded({ extended: false })); //bodyparse usage
app.use(bodyparser.json());
app.use(cookieParser());

app.get("/api/moviesList", auth, async function (req, res) {
    try {
        var movies = await Movie.find(req.query);
        const movieGroupedByGenres = groupBy(movies, 'genres');
        res.status(200).send({
            message: "list of movies",
            movieGroupedByGenres
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {}); 
  };

app.post("/api/movies", auth, async function (req, res) {
    try {
        var movie = new Movie(req.body);
        await movie.save();
        res.status(201).send({
            message: "Movie created successfully",
            movie
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
})

app.get("/api/admin",function(req, res){
    res.send("Welcome to admin");
})

app.post("/api/admin", async function (req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        var admin = new Admin(req.body);
        await admin.save();
        res.status(201).send("Admin created successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

app.post("/api/login", async function(req, res){
    try{
        var admin = await Admin.findOne({ 
            email: req.body.email
        })

        if(!admin){
            res.status(400).send("Unable to login");
            return;
        }
        
        var isMatch = await bcrypt.compare(req.body.password, admin.password);
        
        if(!isMatch){
            res.status(400).send("Unable to Login");
            return;
        }

        var token = jwt.sign({_id: admin._id}, process.env.SECRET_KEY, {expiresIn: "1 days"});

        res.status(200).send({
            msg: "Login successfully",
            admin,
            token
        });
    }catch(error){
        console.log(error);
        res.status(500).send("Internal server error");
    }
})

app.listen(port, function () {
    console.log("Server is run upon port 2000")
})