const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        // Get access token from Authorization header
        const accessToken = req.headers.authorization?.split(" ")[1];
        
        // If no access token, return unauthorized immediately
        if (!accessToken) {
            return res.status(401).json({ msg: "Access Denied" });
        }
        
        try {
            // First try to verify the access token
            const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
            req.user = decoded;
            return next();
        } catch (error) {
            // Access token verification failed
            
            // Check if it's because the token expired
            if (error.name !== 'TokenExpiredError') {
                // If it's not because of expiration, return forbidden
                return res.status(403).json({ msg: "Invalid Token" });
            }
            
            // Token expired, check for refresh token
            const refreshToken = req.headers['x-refresh-token'] || req.cookies?.refreshToken;
            
            if (!refreshToken) {
                return res.status(401).json({ msg: "Access Denied - No Refresh Token" });
            }
            
            try {
                // Verify refresh token
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
                
                // Generate new access token
                const newAccessToken = jwt.sign(
                    { id: decoded.id},
                    process.env.ACCESS_SECRET_KEY,
                    { expiresIn: '1h' } // Adjust expiry time as needed
                );
                
                // Set new access token in response header
                res.setHeader('x-new-access-token', newAccessToken);
                
                // Set user info in request for the next middleware
                req.user = decoded;
                
                // Add flag indicating token was refreshed
                req.tokenRefreshed = true;
                
                return next();
            } catch (refreshError) {
                // Refresh token is also invalid
                return res.status(403).json({ msg: "Invalid Refresh Token - Please Login Again" });
            }
        }
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = verifyToken;