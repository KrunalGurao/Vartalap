const { Router } = require("express");
const { logout, login, register } = require("../controllers/admin.controllers");
const { authorization } = require("../middlewares/auth.middleware");

const adminRouter = Router();

adminRouter.post('/login', login);

adminRouter.get('/logout', authorization, logout);

adminRouter.post('/register', register);

adminRouter.use('/*',(req, res)=>{
    res.status(404).send('Page not found');
})


module.exports = {
    adminRouter
};
