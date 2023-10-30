const express = require("express");
const port = 8000;
const path = require("path");
const app = express();

const mongoose = require("mongoose");
const UrlSchema = require("./models/URLSchema");

//connecting the db
mongoose.connect('mongodb+srv://mongo:mongo@anshulcluster.k7iipbc.mongodb.net/URLShortner', {
    useNewUrlParser: true
});

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


//setting the statics
app.use(express.static('assets'));


//handling the requests
app.get("/", async (req,res)=>{
    //fetching all the data and render it on homepage
    const allData = await UrlSchema.find();
    res.render("index", {allData : allData});
});

app.post("/shortUrl", async (req,res)=>{
    //getting the user input url and shortening it
    const checkData = await UrlSchema.findOne({full: req.body.fullUrl});
    if(!checkData){
        const data = await UrlSchema.create({
            full: req.body.fullURL
        });
        return res.redirect('/');
    }
    alert("alread exist");
    return res.redirect("/");

});

app.get("/:newUrl", async (req,res)=>{
    const mainUrl = await UrlSchema.findOne({short: req.params.newUrl});
    //if not found
    if(!mainUrl){return res.sendStatus(404)}
    // if found
    mainUrl.clicks++;
    mainUrl.save();
    return res.redirect(mainUrl.full);

});



app.listen(port, (err)=>{
    if(err){
        console.log("Error in server ", err);
        return;
    }
    console.log("server running on port ", `${port}`);
});