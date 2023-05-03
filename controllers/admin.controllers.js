const jwt = require('jsonwebtoken');
const { hash, compare } = require("bcrypt");
const { userModel } = require("../models/user.models");
const { blacklistModel } = require('../models/blacklist.model');
require('dotenv').config();

const login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const isUserValid = await userModel.findOne({email});
        if(!isUserValid) return res.status(404).send({msg: "Wrong Credentials"});
        const result = await compare(password, isUserValid.password);
        if(result){
            const access_token = jwt.sign({userId: isUserValid._id}, process.env.JWT_SECRET_KEY, {expiresIn: '4h'});
            return res.status(200).send({msg: 'Receiving from frontend', access_token});
        }
        return res.status(404).send({msg: 'Wrong Credentials'});
    }catch(err){
        console.log("/admin/login: ", err.message);
        res.status(500).send({msg: err.message});
    }
}

const register = async (req, res)=>{
    try{
        let {name, email, password, role} = req.body;
        password = await hash(password, Number(process.env.SALT_ROUNDS));
        const newUser = new userModel({name, email, password, role});
        await newUser.save();
        res.status(200).send({msg: 'User Created'});
    }catch(err){
        console.log('/admin/register: ', err.message);
        res.status(500).send({msg: err.message});
    }
}

const logout = async (req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        const blacklisted = new blacklistModel({"token": token});
        await blacklisted.save();
        // console.log(blacklisted);
        res.status(200).send({msg: 'Logout Successful'});
    }catch(err){
        console.log('/admin/logout: ', err.message);
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}


module.exports = {
    login, logout, register
}

