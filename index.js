const express = require('express')
const app = express()

app.set('view engine','ejs')
app.set(express.static("public"))

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/',(req,res)=>{
    res.render("index")
})

app.listen(8080,()=>{
    console.log("Servidor está rodando");
})