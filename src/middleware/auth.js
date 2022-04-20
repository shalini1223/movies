const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

var auth = async function (req, res, next) {
    try {
        var token = req.header("Authorization").replace("Bearer ", "");
        var decode = await jwt.verify(token, process.env.SECRET_KEY);
        var admin = await Admin.findById(decode._id);

        if (!admin) {
            res.status(403).send("Please authenticate");
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(403).send("Please authenticate");
    }
}

module.exports = auth;
