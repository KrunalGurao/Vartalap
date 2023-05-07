const express = require('express');
const {userModel} = require("../models/user.models");
const userRouter = express.Router()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


//***********************************************(REGISTER)****************************************** */



userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    try {
        const isUserPresent = await userModel.findOne({email})
        if(isUserPresent){
            return res.send({"ok":false,"msg":"User is already present login directly"})
        }
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new userModel({ name, email, password: hash })
            await user.save()
            res.status(201).send({ "ok":false,"msg": "Registration Successfully" })

        });
    } catch (error) {
        res.status(401).send({ "msg": "Some error occoured while registration..." })

    }

})



//****************************************(LOGIN)***************************************************** */



userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credential' });
          }
    
       else if(user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    res.status(201).send({ "msg": "login successfully", "token": jwt.sign({ "userID": user._id }, "privateKey", { expiresIn: '3h' }),"userdetails":user })
                } else {
                    res.status(401).send({ "msg": "Wrong Credentials" })
                }
            });
        }}
     catch (error) {
        res.status(401).send({ "msg": "error occoured while login" })

    }
})




//********************************************(Google)********************************************** */


// userRouter.post("/login", async (req, res) =>{

    // try {
        
//     passport.use(new GoogleStrategy({
//     clientID: "1044555666075-pa5siir8m46p5g1sc18p6jtnmgi0p8i5.apps.googleusercontent.com",
//     clientSecret: "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",
//     callbackURL: "http://localhost:8080/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(accessToken, refreshToken, profile)
//     return cb (`Hey ${profile._json.name}, you are successfully sign in with Google`)
//   }
// ));
        
        // userRouter.get('/auth/google',
        //   passport.authenticate('google', { scope: ['profile', 'email'] }));

        // userRouter.get('/auth/google/callback', 
        //   passport.authenticate('google', { failureRedirect: '/login',session: false }),
        //   function(req, res) {
        //     res.redirect('/');
        //   });
//     } catch (err) {
//         res.status(401).send({ "msg": "error occoured while login" })
//     }

// })
















userRouter.get("/", async (req, res) => {
    const user = await userModel.find()
    res.status(201).send(user)
})




module.exports = {userRouter}