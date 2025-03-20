const User = require('../Model/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const login = async(req, res)=>{
//     let {email, password} = req.body;

//     const user = await User.findOne({email});
    
//     if(!user) return res.status(400).json({msg: "Invalid credentials"});

//     const isMatch = await bcrypt.compare(password, user.password);

//     if(!isMatch) return res.status(400).json({msg: "Invalid cradentials"});

//     const AcessToken = jwt.sign({id: user._id},process.env.ACCESS_SECRET_KEY , {expiresIn:"1h"} );
//     const RefreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET_KEY, {expiresIn: "7d"});

//     res.json({AcessToken, RefreshToken});
// }

// const signup = async(req,res)=>{
//     const {name, email, password} = req.body;
//     if (!name || !email || !password) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'Email already exists' });


    
//      const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
//     const user = new User({name, email, password: hashPassword})
//     await user.save();
//     res.status(201).json({msg: 'user registered successfully'});
// }

// module.exports = {login, signup};

const generateToken = (user)=>{
    const accessToken = jwt.sign(
        {id:user._id},
        process.env.ACCESS_SECRET_KEY,
        {expiresIn: "1h"}
    )
    const refreshToken = jwt.sign(
        {id:user._id},
        process.env.REFRESH_SECRET_KEY,
        {expiresIn: "7d"}
    )

    return {accessToken , refreshToken}
}

const signup = async(req, res)=>{
    try {
        const {name, email, password}=req.body;

        if(!name && !email && !password){
            return res.status(500).json({msg: "plzz give the info"})
        }
       
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({msg: "user already exist"})
    
       const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const user = new User({name , email , password: hashedPassword});
        await user.save();

        res.status(201).json({msg: "user register Sucessfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
}

const login = async(req,res)=>{
      try {
        const {email,password}= req.body;
        if(!email || !password) return res.status(400).json({msg: "plz give me id or password"});

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({msg: "user not found"});
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg: "Invalid password"});

       

        const {accessToken, refreshToken} = generateToken(user);
        res.json({msg: "login Sucessfully", accessToken, refreshToken});

      } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
      }
}

const refreshToken = async(req,res)=>{
      const {refreshToken} = req.body;

      if(!refreshToken) return res.status(403).json({msg: "Invalid refresh token"});

      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err,user)=>{
        if(err) return res.status(403).json({msg: "Invalid refresh token"});

        const newAcessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_KEY, {expiresIn:"1hr"});
        res.json({accessToken: newAcessToken})
      })
}

module.exports = {signup, login , refreshToken};
