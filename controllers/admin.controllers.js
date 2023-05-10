const jwt = require('jsonwebtoken');
const { hash, compare } = require("bcrypt");
const { userModel } = require("../models/user.models");
const { blacklistModel } = require('../models/blacklist.model');
const { logModel } = require('../models/logger.model');
require('dotenv').config();

const login = async (req, res)=>{
    try{
        console.log('Reaching the Correct endpoint /login');
        const {email, password} = req.body;
        const isUserValid = await userModel.findOne({email});
        if(!isUserValid) return res.status(404).send({msg: "Wrong Credentials"});
        const result = await compare(password, isUserValid.password);
        if(result && isUserValid.role==='admin'){
            const access_token = jwt.sign({userId: isUserValid._id}, process.env.JWT_SECRET_KEY, {expiresIn: '4h'});
            return res.status(200).send({msg: 'Receiving from frontend', access_token, 'admin': isUserValid.name});
        }
        return res.status(404).send({msg: 'Wrong Credentials'});
    }catch(err){
        console.log("/admin/login: ", err.message);
        res.status(500).send({msg: err.message});
    }
}

const adminInfo = async (req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findById(decoded.userId);
            if(user.role!=='admin'){
                res.status(400).send({msg: 'You are not authorized to perform this functionality'});
            }else{
                res.status(200).send({name: user.name, email: user.email, icon: user.icon, role: user.role});
            }
        }else{
            
            res.status(400).send({msg: "Something Went wrong"});
        }
    }catch(err){
        console.log('/admin/adminInfo', err.message);
        res.status(500).send({msg: 'Something went wrong'});
    }
}

const adminAuth = async (req, res) => {
    let isUserValid = await userModel.findOne({ email: req.user.email });
    if (isUserValid && isUserValid.role === 'admin') {
        const access_token = jwt.sign({ userId: isUserValid._id }, process.env.JWT_SECRET_KEY, { expiresIn: '4h' });
        isUserValid.token = access_token;
        const queryString = JSON.stringify(access_token);
        res.redirect(`https://adminside-production.up.railway.app?${queryString}`);
    }
    else
        res.status(400).send({ msg: "You are not authorized" });
}

const trafficReport = async (req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findById(decoded.userId);
            if(user.role!=='admin'){
                res.status(400).send({msg: 'You are not authorized to perform this functionality'});
            }else{
                let list = await logModel.aggregate([{$group: {_id: '$path', count: {$sum: 1}}}])
                res.status(200).send(list);;
            }
        }else{
            
            res.status(400).send({msg: "Something Went wrong"});
        }
    }catch(err){
        res.send('Something went wrong');
    }
}

const listingAdmin = async (req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findById(decoded.userId);
            if(user.role!=='admin'){
                res.status(400).send({msg: 'You are not authorized to perform this functionality'});
            }else{
                const list = await userModel.aggregate([{$match: {role: "admin"}},{$project: {_id:0, name: 1, email: 1, icon: 1}}]);
                res.status(200).send(list);
            }
        }else{
            
            res.status(400).send({msg: "Something Went wrong"});
        }
    }catch(err){
        console.log('admin/list: ', err.message);
        res.status(500).send({msg: err.message});
    }
}

const topTwoRoutes = async (req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findById(decoded.userId);
            if(user.role!=='admin'){
                res.status(400).send({msg: 'You are not authorized to perform this functionality'});
            }else{
                const list = await logModel.aggregate([{$group: {_id: '$path', count:{$sum: 1}}},{$sort: {count: -1}}, {$limit: 2}])
                res.status(200).send(list);
            }
        }else{
            
            res.status(400).send({msg: "Something Went wrong"});
        }
    }catch(err){
        console.log('/admin/topTwoRoutes: ', err.message);
        res.status(500).send({msg: err.message});
    }
}

const userInfo = async (req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findById(decoded.userId);
            if(user.role!=='admin'){
                res.status(400).send({msg: 'You are not authorized to perform this functionality'});
            }else{
                const list = await userModel.aggregate([{$match: {role: 'user'}}, {$project: {_id: 1, name:1, isBlock: 1, email: 1, icon: 1}}]);
                res.status(200).send(list);
            }
        }else{
            
            res.status(400).send({msg: "Something Went wrong"});
        }
    }catch(err){
        console.log('/admin/userInfo: ', err.message);
        res.status(500).send({msg: err.message});
    }
}


const updatingStatus = async (req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findById(decoded.userId);
            if(user.role!=='admin'){
                res.status(400).send({msg: 'You are not authorized to perform this functionality'});
            }else{
                const {id} = req.params;
                const status = req.query;
                await userModel.findByIdAndUpdate(id, status);
                res.status(200).send({msg: 'updation completed'});
            }
        }else{
            
            res.status(400).send({msg: "Something Went wrong"});
        }
    }catch(err){
        console.log('/admin/userInfo: ', err.message);
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
        res.status(200).send({msg: 'Logout Successful'});
    }catch(err){
        console.log('/admin/logout: ', err.message);
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}


module.exports = {
    login, logout, adminInfo, adminAuth, listingAdmin, trafficReport, topTwoRoutes, userInfo, register, updatingStatus
}

