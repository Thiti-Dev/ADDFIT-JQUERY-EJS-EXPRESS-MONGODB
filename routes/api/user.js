const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key');
const passport = require('passport');

const router = express.Router();


//load Database
const User = require('../../models/User')

//load validator
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// @route       GET api/user/register
// @desc        Register user
// @access      Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);


    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'มีผู้อื่นได้ใช้อีเมล์นี้แล้ว'
                return res.status(400).json(errors)
            } else {
                const newUser = new User({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    phone: req.body.phone,
                    gender: req.body.gender
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.json(user);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                })
            }
        })
});

// @route       GET api/users/login
// @desc        Login User / Returning JWT Token
// @access      Public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({ email })
        .then(user => {
            //check for user
            if (!user) {
                errors.email = 'ไม่พบชื่อผู้ใช้นี้'
                return res.status(404).json(errors)
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User matched
                        const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT Payload
                        //Sign token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });
                    } else {
                        errors.password = 'พาสเวิร์ดไม่ถูกต้อง';
                        return res.status(404).json(errors)
                    }
                })
        })
});

// @route       POST api/users/updateBMI
// @desc        uodate BMI
// @access      Private
router.post('/updateBMI', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
        .then(userData => {
            //console.log(userData)
            userData.bmi = req.body.bmi;
            userData.height = req.body.height;
            userData.weight = req.body.weight;
            userData.save()
                .then(data =>{
                    res.json(data)
                })
                .catch(err => {
                    res.status(400).json(err)
                })
        })
});

// @route       GET api/users/current
// @desc        Return current user
// @access      Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        gender: req.user.gender,
        profilePicture: req.user.profilePicture
    });
});


// @route       GET api/users/current
// @desc        Return current user
// @access      Private
router.get('/getProfileData', passport.authenticate('jwt', { session: false }), (req, res) => {
    /*res.json({
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        gender: req.user.gender
    });*/
    User.findById(req.user.id).select("firstName lastName email phone gender weight height profilePicture")
        .then(data => {
            res.json(data);
        })
});


module.exports = router