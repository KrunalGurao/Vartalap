const { Router } = require("express");
const { logout, login, adminInfo, adminAuth, listingAdmin, trafficReport, topTwoRoutes } = require("../controllers/admin.controllers");
const { authorization } = require("../middlewares/auth.middleware");
require('../configs/googleOauth');
const passport = require('passport');
const { userModel } = require("../models/user.models");
const adminRouter = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();


adminRouter.post('/login', login);

adminRouter.get('/logout', authorization, logout);

adminRouter.get('/adminInfo', authorization, adminInfo)

adminRouter.get('/traffic', authorization, trafficReport);

adminRouter.get('/topTwoRoutes', authorization, topTwoRoutes);

adminRouter.get('/list', authorization, listingAdmin);

adminRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


adminRouter.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login', session: false}), adminAuth);



adminRouter.use('/*', (req, res) => {
    res.status(404).send('Page not found');
})


module.exports = {
    adminRouter
};
