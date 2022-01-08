const express = require('express')
const router = express.Router();


const User = require('./users');
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');

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


    User.findOne({where:{email:email}}).then(user =>{
        if (user == undefined) {
            res.redirect("/admin/users/create")
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
            
        }else{
            res.redirect("/admin/users/create")
        }
    })

    //res.json({email,password})
})

router.get("/login",(req,res)=>{
    res.render("admin/users/login")
})

router.post("/authenticate",(req,res)=>{
    let email = req.body.email
    let password = req.body.password

    User.findOne({where:{email:email}}).then(user =>{
        if (user != undefined) {
            let correct = bcrypt.compareSync(password,user.senha)
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email:user.email
                }
                res.json(req.session.user)
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })
})

module.exports = router