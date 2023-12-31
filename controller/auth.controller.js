const User = require('../model/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const passport = require("passport");
const path = require('path');

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
}
module.exports = {
    register,
    login,
    getLogin,
    getSignUp,
    getWelcome,
    logout
}