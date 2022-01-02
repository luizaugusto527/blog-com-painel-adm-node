const express = require('express')
const category = require('./categories')
const slugify = require('slugify')
const router = express.Router()

router.get('/admin/categories/new',(req,res)=>{
    res.render("admin/categories/new")
})

router.post('/categories/save',(req,res)=>{
   let title = req.body.title
   
   if (title != undefined) {
       category.create({
           title:title,
           slug:slugify(title)
       }).then(()=>{
           res.redirect('/')
       })
    }else{
       res.redirect('/admin/categories/new')
   }
})

module.exports = router