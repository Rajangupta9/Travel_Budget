const express = require('express');
const connectdb = require('./Config/db')
const userRouter = require('./Routes/userRoutes')
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

connectdb();


app.use("/user", userRouter);
app.get("/", (req,res)=>{
    res.send("api is working");
});

const PORT = process.env.PORT || 5001;


app.listen(PORT, ()=>{
    console.log(`your server is running on http://localhost:${PORT}/ `);
}); 