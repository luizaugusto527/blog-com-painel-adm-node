const express = require('express')
const connection = require("./database/database")

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const Article = require('./articles/article')
const Category = require('./categories/categories')

const app = express()

app.set('view engine','ejs')

app.use(express.static("public"))

app.use(express.urlencoded({extended:false}))
app.use(express.json())

connection.authenticate()
.then(()=>console.log("Conexão com sucesso"))
.catch((error)=>console.log(error))

app.use('/',categoriesController)
app.use('/',articlesController)

app.get('/',(req,res)=>{
    res.render("index")
})

app.listen(8080,()=>{
    console.log("Servidor está rodando");
})