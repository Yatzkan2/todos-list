const express = require('express')
const app = express()
const {v4:uuid} = require('uuid')
const path = require('path')
const methodOverride = require('method-override')
const PORT = 3000
let tasks = [
    {id: uuid(), task: "go gold mining"}, 
    {id: uuid(), task: "build a pirate ship"},
    {id: uuid(), task: "make a pumpkin pie"}, 
    {id: uuid(), task: "kill all the phonies"}
]

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public'))); //wer'e using static files to pass .html, .css and .js files to the user in one directory called 'public'
console.log(path.join(__dirname, 'public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/todos/new', (req, res)=>{
    res.render('todos/new')
})
app.post('/todos', (req, res)=>{
    const newTask = req.body.task
    if(newTask === null || newTask.match(/^\s*$/) !== null){
        res.redirect('todos/new')
    }
    else {
        tasks.push({id: uuid(), task: newTask})
        res.redirect('/todos')
    }
})
app.get('/todos/show/:id', (req, res)=>{
    const { id } = req.params
    const task = tasks.find(t => id === t.id)
    res.render('todos/show',{...task})
})
app.get('/todos', (req, res)=>{
    res.render('todos/index', {tasks})
})
app.get('/todos/:id/edit', (req, res)=>{
    const { id } = req.params 
    const task = tasks.find(t => id === t.id)
    res.render('todos/edit', {...task})
})
app.patch('/todos/:id', (req, res)=>{
    const { id } = req.params
    const edittedTask = req.body.task
    const oldTask = tasks.find(t => id === t.id)
    oldTask.task = edittedTask;
    res.redirect('/todos')
    
})
app.delete('/todos/:id', (req, res)=>{
    const { id } = req.params
    tasks = tasks.filter(t => id !== t.id)
    res.redirect('/todos')
})
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})

