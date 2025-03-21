const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({msg: "Access Denied"});
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decode)=>{
        if(err) return res.status(403).json({msg: "Invalid Token"});
        req.user = decode;
        next();
    });
    
}

module.exports = verifyToken;