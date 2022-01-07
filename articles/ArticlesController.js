const express = require('express')
const router = express.Router()
const Category = require('../categories/categories')
const Article = require("./article")
const slugify = require("slugify")
const article = require('./article')

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles })
    })


})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then((categories) => {

        res.render('admin/articles/new', { categories: categories })
    })

})

router.post("/articles/save", (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category

    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.post("/articles/delete", (req, res) => {
    let id = req.body.id

    if (id != undefined) {
        if (!isNaN(id)) {

            article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })

        } else {
            res.redirect("/admin/articles")
        }

    } else {
        res.redirect("/admin/articles")
    }
})
router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id
    article.findByPk(id).then(article => {
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, article: article })

            })
        } else {
            res.redirect("/")
        }
    })
})

router.post("/articles/update", (req, res) => {
    let id = req.params.id
    let body = req.params.body
    let title = req.body.title
    let category = req.body.category

    article.update({ title: title, body: body, categoryId: category, slug: slugify(title) }, {
        where: { id: id }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(() => {
        res.redirect("/")
    })

})

module.exports = router