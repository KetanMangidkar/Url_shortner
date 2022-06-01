 const express = require("express");
 const mongoose = require("mongoose");
 const ShortUrl = require("./models/shorturl");
 const short = express();
 
 mongoose.connect("mongodb://localhost/UrlShortner", {
     useNewUrlParser: true, useUnifiedTopology:true
 })

  short.set("view engine", "ejs")
  short.use(express.urlencoded({extended:false}))

 short.get("/", async (req, res) => {
    const shortUrls = await ShortUrl.find()
     res.render("index", { shortUrls : shortUrls })
 })

 short.post("/shortUrls", async (req,res) => {
    await ShortUrl.create({full: req.body.fullUrl })
    res.redirect("/")
 })

 short.get("/:shortUrl", async(req,res)=>{
     const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
     if(shortUrl == null) return res.sendStatus(404)

     shortUrl.clicks++;
     shortUrl.save();
     res.redirect(shortUrl.full)
    })

 short.listen(process.env.PORT || 8080);