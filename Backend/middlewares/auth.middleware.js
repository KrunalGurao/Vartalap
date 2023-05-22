const { verify } = require("jsonwebtoken");
const { blacklistModel } = require("../models/blacklist.model");
const { userModel } = require("../models/user.models");
require('dotenv').config();

const authorization = async (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        const isPresent = await blacklistModel.findOne({token});
        if(isPresent) return res.status(400).send({msg: 'Login Again'});
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded) return res.status(400).send({msg: 'Login Again'});
        const user = await userModel.findOne({_id: decoded.userId});
        if(user) return next();
        return res.status(500).send({msg: 'Something went wrong'})
    }catch(err){
        console.log('./middlewares/auth.middleware.js :', err.message);
        res.status(500).send({msg: err.message});
    }
}


module.exports = {
    authorization
}
