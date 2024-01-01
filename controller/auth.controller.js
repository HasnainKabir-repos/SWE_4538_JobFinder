const User = require('../model/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const passport = require("passport");
const path = require('path');
const sendEmail = require('../utils/sendEmail');
const checkExistingUser = async(user) => {
    try{
        const newuser = await User.findOne({email: user.email});

        if(newuser){
            return false;
        }else{
            return true;
        }
    }catch(error){
        console.log(error);
        return false;
    }
}

const register = async(req, res) => {
    try{
        const user = req.body;

        if(!checkExistingUser(user)) res.status(400).json({message: "User already exists"});
        
        else{
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
           
            const newUser = {
                name: user.name,
                email: user.email,
                password: hash
            }

            await User.create(newUser);

            res.status(200).json({message: "User created successfully"});
        }    

    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}

const login = async(req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/auth/welcome",
        failureRedirect: "/auth/login",
        failureFlash: true,
    })(req, res, next);
}

const getLogin = async (req, res) => {
    const filePath = path.join(__dirname, "..", "views", "login.html");
    res.sendFile(filePath);
};

const getSignUp = async (req, res) => {
    const filePath = path.join(__dirname, "..", "views", "signup.html");
    res.sendFile(filePath);
};

const getWelcome = async(req, res) => {
    const filePath = path.join(__dirname, "..", "views", "welcome.html");
    res.sendFile(filePath);
};

const logout = async(req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/auth/login');
    });
};

const getForgotPass = async(req, res) => {
    const filePath = path.join(__dirname, "..", "views", "forgot_pass.html");
    res.sendFile(filePath);
};

const constructURL = (id) => {
    return `${process.env.BASE_URL}auth/reset/${id}`;
}

const constructBody = (url) => {
    return `<p>Hello,</p>
    <p>We received a request to reset the password for your account.</p>
    <p>Please click <a href="${url}">here</a> to set a new password.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best Regards,</p>
    <p>Team CampusWorks</p>`;
}

const sendResetLink = async(req, res) => {
    try{

        const email = req.query.email;
        const user = await User.findOne({email: email});
        if(!user){
            res.status(401).json({message:"User does not exist"});
        }else{

            const user = await User.findOne({email: email});

            const url = constructURL(user._id);

            const body = constructBody(url);

            await sendEmail(email, "Password reset", body);

            res.status(200).json({message: "Email Sent"});
        }

    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
};

let userId;

const getUserID = async(req, res) => {
    try{
        userId = req.params.id;
        const filePath = path.join(__dirname, "..", "views", "reset_pass.html");
        res.sendFile(filePath);
    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
    
};

const updatePassword = async(req, res) => {
    try{
        const password = req.body.password;
        const user = await User.findById(userId);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user.password = hash;
        await user.save();

        res.status(200).json({message:"password updated successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

module.exports = {
    register,
    login,
    getLogin,
    getSignUp,
    getWelcome,
    logout,
    getForgotPass,
    sendResetLink,
    updatePassword,
    getUserID
}