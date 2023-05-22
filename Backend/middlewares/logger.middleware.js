const { logModel } = require("../models/logger.model");

const logger = async (req, res, next)=>{
    let obj = {};
    obj.ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    obj.timestamp = new Date();
    obj.metaData = req.headers;
    obj.path = req.path;
    const newLog = new logModel(obj);
    await newLog.save();
    next();
}

module.exports = {
    logger
}
