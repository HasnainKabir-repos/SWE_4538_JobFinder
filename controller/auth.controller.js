const User = require('../model/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const generateJwt = require('../config/generate_token');

const checkExistingUser = async(user) => {
    try{
        const user = await User.findOne({email: user.email});

        if(user){
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

        if(checkExistingUser(user)) res.status(400).json({message: "User already exists"});
        
        else{
            const salt = bcrypt.genSalt(10);
            const hash = bcrypt.hash(user.password, salt);

            const newUser = await User.create(user);

            res.status(200).json({message: "User created successfully"});
        }    

    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}

const login = async(req, res) => {
    try{
        const credentials = req.body;

        const user = await User.findOne({email: credentials.email});

        if(!user) res.status(400).json({message: "User does not exist"});

        else{
            const match = await bcrypt.compare(credentials.password, user.password);

            if(!match){
                res.status(400).json({message: "Password does not match"});
            }else{
                const token = generateJwt(user);
                res.status(200).json({message: "Successfully logged in", token:token});
            }
        }
    
    }catch(error){
        console.log(error);
    }
}
