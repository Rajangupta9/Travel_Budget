const User = require('../Model/userModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


const login = async(req, res)=>{
    let {email, password} = req.body;

    const user = await User.findOne({email});
    
    if(!user) return res.status(201).json({msg: "Invalid credentials"});

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.status(201).json({msg: "Invalid cradentials"});

    const AcessToken = jwt.sign({id: user._id},process.env.ACCESS_SECRET_KEY , {expiresIn:"1h"} );
    const RefreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET_KEY, {expiresIn: "7d"});

    res.json({AcessToken, RefreshToken});
}

const signup = async(req,res)=>{
    const {name, email, password} = req.body;
     const hashPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS)
    const user = new User({name, email, password: hashPassword})
    await user.save();
    res.status(201).json({msg: 'user registered successfully'});
}

module.exports = {login, signup};
