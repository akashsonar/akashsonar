//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDB");

app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const secret = process.env.MYKEY;
userSchema.plugin(encrypt, {
    secret: secret,
    encryptedFields: ["password"]
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});


app.get("/register", (req, res) => {
    res.render("register");
});


app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email: username,
        password: password
    });
    newUser.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne((err, result) => {
        console.log(result.password);
        if (err) {
            console.log(err);
        } else {
            if (result.password === password) {
                res.render("secrets");
            } else {
                console.log("wrong password!!");
                res.send("wrong password Try again!!");
            }
        }
    });
});

app.listen(8888, () => {
    console.log("Server started successfully at port 8888");
});