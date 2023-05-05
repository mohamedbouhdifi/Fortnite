import express from "express";

const app = express();
/*
const { MongoClient} = require('mongodb');

const uri: string = "mongodb+srv://s122085:Pw00057057@cluster0.1gluz1x.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });



const main = async () => {
    try {
        await client.connect();
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();*/


app.set("port", 3000);
app.set("view engine", "ejs");

app.use(express.static('public'))
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }))

app.get("/LandingPage", (req: any, res: any) => {
    res.render("LandingPage");
})

app.get("/Login", (req: any, res: any) => {
    
    res.render("LoginPage");
})

app.get("/Avatars", (req: any, res: any) => {
    res.render("Homepage");
})

app.get("/FavouritePage", (req: any, res: any) => {
    res.render("FavouritePage");
})


app.get("/BlacklistPage", (req: any, res: any) => {
    res.render("BlacklistPage");
    
})

app.get("/Profile", (req: any, res: any) => {
    res.render("Profile");
    
})

app.get("/PrivacyPolicy", (req: any, res: any) => {
    res.render("PrivacyPolicy");
    
})


app.listen(app.get("port"), () => {
    console.log(`Web application started at http://localhost:${app.get("port")}`)
})