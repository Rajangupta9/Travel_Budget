const express = require('express');
const connectdb = require('./Config/db')

require("dotenv").config();
const app = express();

app.use(express.json());
connectdb();
app.get("/", (req,res)=>{
    res.send("api is working");
});

const PORT = process.env.PORT || 5001;


app.listen(PORT, ()=>{
    console.log(`your server is running on http://localhost:${PORT}/ `);
}); 