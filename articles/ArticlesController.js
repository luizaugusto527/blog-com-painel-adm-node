const express = require('express')
const router = express.Router()
const Category = require('../categories/categories')
const Article = require("./article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles })
    })


})

router.get('/admin/articles/new',adminAuth, (req, res) => {
    Category.findAll().then((categories) => {

        res.render('admin/articles/new', { categories: categories })
    })

})

router.post("/articles/save",adminAuth, (req, res) => {
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

router.post("/articles/delete",adminAuth, (req, res) => {
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
router.get("/admin/articles/edit/:id",adminAuth, (req, res) => {
    let id = req.params.id
    Article.findByPk(id).then(article => {
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, article: article })

            })
        } else {
            res.redirect("/")
        }
    })
})

router.post("/articles/update",adminAuth, (req, res) => {
    let id = req.params.id
    let body = req.params.body
    let title = req.body.title
    let category = req.body.category

    Article.update({ title: title, body: body, categoryId: category, slug: slugify(title) }, {
        where: { id: id }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(() => {
        res.redirect("/")
    })

})


router.get("/articles/page/:num", (req, res) => {
    let num = Number(req.params.num)
    let offset = (num - 1) * 2

    Article.findAndCountAll({
        limit: 2,
        offset: offset,
        order: [['id', 'DESC']]

    }).then(article => {
        if (offset + 2 >= article.count) {
            next = false;
        } else {
            next = true;
        }
        let result = {
            page: num,
            next: next,
            article: article
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page", { result: result, categories: categories })
        })
    })
})

module.exports = router