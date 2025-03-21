const User = require("../Model/userModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../Config/nodeMailer");
require("dotenv").config();

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return res.status(500).json({ msg: "plzz give the info" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "user already exist" });

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: "user register Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "plz give me id or password" });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "user not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const { accessToken, refreshToken } = generateToken(user);
    res.json({ msg: "login Sucessfully", accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(403).json({ msg: "Invalid refresh token" });

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Invalid refresh token" });

      try {
        // Optionally verify the user exists in DB
        const user = await User.findById(decoded.id);
        if (!user) return res.status(403).json({ msg: "User not found" });

        // Use the same key that's used in generateToken
        const newAccessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_SECRET_KEY,  // This should match the key in generateToken
          { expiresIn: "1h" }
        );
        
        res.json({ accessToken: newAccessToken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ msg: "Email is required" });
      }
      
      const user = await User.findOne({ email });
      
      // For security reasons, don't reveal whether the user exists or not
      if (!user) {
        return res.status(200).json({ 
          msg: "If the email exists, a reset link and OTP will be sent."
        });
      }
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, parseInt(process.env.SALT_ROUNDS));
      const resetToken = crypto.randomBytes(32).toString("hex");
      
      user.resetOtp = hashedOtp;
      user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour
      await user.save();
      
      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset Request",
        text: `Your OTP for password reset is: ${otp} (valid for 10 minutes).\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4f46e5;">Password Reset Request</h2>
            <p>Your OTP for password reset is: <strong style="font-size: 18px;">${otp}</strong> (valid for 10 minutes)</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(to right, #4f46e5, #7e3af2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0;">Reset Password</a>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">If you did not request this, please ignore this email.</p>
          </div>
        `
      };
  
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Forgot Password Error:", error);
          return res.status(500).json({ msg: "Internal Server Error" });
        }
        
        console.log("Email sent:", info.response);
        res.json({
          msg: "If the email exists, a reset link and OTP will be sent."
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
  const verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ msg: "Email and OTP are required" });
      }
      
      const user = await User.findOne({ 
        email, 
        resetOtpExpires: { $gt: Date.now() } 
      });
      
      if (!user) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
      }
      
      // Verify OTP
      const isMatch = await bcrypt.compare(otp, user.resetOtp);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid OTP" });
      }
      
      // Return success with reset token
      res.json({ 
        msg: "OTP verified successfully", 
        resetToken: user.resetToken 
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
  const resetPassword = async (req, res) => {
    try {
      const { resetToken, password, otp } = req.body;
      
      if (!resetToken || !password) {
        return res.status(400).json({ msg: "Reset token and new password are required" });
      }
      
      const user = await User.findOne({ 
        resetToken,
        resetTokenExpires: { $gt: Date.now() } 
      });
      
      if (!user) {
        return res.status(400).json({ msg: "Invalid or expired reset token" });
      }
      
      // If OTP is provided, verify it
      if (otp) {
        // Check if OTP is still valid
        if (user.resetOtpExpires < Date.now()) {
          return res.status(400).json({ msg: "OTP has expired" });
        }
        
        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid OTP" });
        }
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS)
      );
      
      // Update user with new password
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      user.resetOtp = null;
      user.resetOtpExpires = null;
      
      await user.save();
      
      res.json({ msg: "Password reset successful" });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  };

  const profile = async (req, res) => {
    try {
      const user = await User.findById({ _id: req.user.id }).select("-password"); // Exclude password
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ msg: "Error fetching profile", error });
    }
  }
  
  module.exports = { signup, login, refreshToken, forgotPassword, verifyOTP, resetPassword, profile };