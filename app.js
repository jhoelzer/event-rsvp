const express = require("express");
const mongoose = require("mongoose");

const port = 3000;
const url = "mongodb://localhost:27017/rsvp";
const app = express();


app.use(express.static("public/"));
app.use(express.urlencoded());
app.set("view engine", "pug");

mongoose.connect(url);

const Schema = mongoose.Schema;
const resSchema = new Schema ({
    name: String,
    email: String,
    attending: String,
    guests: Number
});

const Response = mongoose.model("Response", resSchema);
const rsvp = mongoose.connection;

rsvp.on("error", console.error.bind(console, "connection error"));
rsvp.once("open", function() {
    console.log("success");
});

app.listen(port, console.log("Listening on port " + port));

app.get("/", function(req, res) {
    res.render("getPug");
});

app.get("/guestlist", function(req, res) {
    Response.find(function(err, userRes) {
        if (err) return console.error(err);
        console.log(userRes);
        res.render("guestList", ({ userRes }));
    });
});

app.post("/rsvp", function(req, res) {
    const userRes = new Response ({
        name: req.body.name,
        email: req.body.email,
        attending: req.body.attending,
        guest: req.body.guest
    });
    userRes.save(function (err, userRes) {
        if (err) return console.error(err);
        res.render("postPug");
    });
});