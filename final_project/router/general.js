const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(400).json({message:"Username and password are required"})
    }
    if(userExists(username)){
        res.status(409).json({message:"Username already exists"})
    }
    const newUser ={
        username: username,
        password: password
    }
    saveUser(newUser)
    res.status(201).json({message:"User registered successfully"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // const promise = new Promise((resolve, reject)=>{
    //     setTimeout(()=>{
    //         resolve(books),
    //         6000
    //     })
    // })
    // promise.then((result)=>{
    //     return res.status(200).json({ books: result });
    // })
    res.status(200).json({books})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const book = books[req.params.isbn]

    if(book){
        return res.status(200).json({book})
    }
    else{
        return res.status(404).json({message:"book not found"})
    }
     
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const booksByAuthor = []
    Object.keys(books).forEach((key)=>{
        const book = books[key]
        if(book.author===author){
            booksByAuthor.push(book)
        }
    })
    if(booksByAuthor.length===0){
        res.status(404).json({message:"no books found"})
    }
    else{
        res.status(200).json(booksByAuthor);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    const booksByTitle=[]
    Object.keys(books).forEach((key)=>{
        const book = books[key]
        if(book.title===title){
            booksByTitle.push(book)
        }
    })
    if(booksByTitle.length===0){
        res.status(404).json({message:"Book not Found"})
    }
    else{
        res.status(200).json(booksByTitle)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if(!books.hasOwnProperty(isbn)){
        res.status(404).json({message:"Book not found"})
    }

    const book = books[isbn]
    const reviews = book.reviews

    if(!reviews || reviews.length===0){
        res.status(404).json({message:"No reviews found for the Book"})
    }
    res.status(200).json(reviews)
});


module.exports.general = public_users;
