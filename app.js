const express = require('express')
const { connectToDB, getDB } = require('./db')
const { ObjectId } = require('mongodb')
// init app & middleware
const app = express()
app.use(express.json())

// db connection
let db
connectToDB((err) => {
    if(!err){
        app.listen(3000,()=>{
            console.log("App listening on port 3000")
        })
        db = getDB();
    }
})


// routes
app.get('/books',(req,res) => {
    const page = req.query.p || 0
    const booksPerPage = 2
    let books = []
    db.collection('books')
        .find()
        .sort({author: 1})
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => {
            books.push(book)
        })
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
})

app.get('/books/:id',(req,res) => {
    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({error: "Not Valid ID"})
    }
    db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(() => {
            res.status(500).json({error: 'Could Not Fetch the Document'})
    })
})

app.post('/books',(req,res) => {
    const book = req.body
    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: "Could Not Create a New Document"})
    })
})

app.delete('/books/:id',(req,res) => {
    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({error: "Not Valid ID"})
    }
    db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({error: 'Could Not Delete the Document'})
    })
})

app.patch('/books/:id',(req,res) => {
    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({error: "Not Valid ID"})
    }
    const updates = req.body
    db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)},{$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({error: 'Could Not Update the Document'})
    })
})