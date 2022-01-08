const express = require('express')
const router = express.Router();


const User = require('./users');
const bcrypt = require('bcryptjs');

router.get("/admin/users",(req,res)=>{
    User.findAll().then(users =>{
        res.render("admin/users/index",{users:users})
    })
})
router.get("/admin/users/create",(req,res)=>{
    res.render('admin/users/create')
})

router.post("/users/create",(req,res)=>{
    let email = req.body.email
    let password = req.body.password

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password,salt)

    User.create({
        email:email,
        senha:hash
    }).then(()=>{
        res.redirect("/")
    }).catch(()=>{
        res.redirect("/")
    })

    //res.json({email,password})
})

module.exports = router