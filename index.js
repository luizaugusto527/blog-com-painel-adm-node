const express = require('express')
const connection = require("./database/database")

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const Article = require('./articles/article')
const Category = require('./categories/categories')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static("public"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

connection.authenticate()
    .then(() => console.log("Conexão com sucesso"))
    .catch((error) => console.log(error))

app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
    Article.findAll({ order: [['id', 'DESC']], limit: 2 }).then(articles => {
        Category.findAll().then(categories => {

            res.render("index", { articles: articles, categories: categories })
        })


    })
})

app.get('/:slug', (req, res) => {
    let slug = req.params.slug
    Article.findOne({
        where: { slug: slug }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {

                res.render("article", { article: article, categories: categories })
            })

        } else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })
            })
        } else {
            res.redirect("/")
        }
    })
})

app.listen(8080, () => {
    console.log("Servidor está rodando");
})