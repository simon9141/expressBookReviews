const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const promise = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(books),
            6000
        })
    })
    promise.then((result)=>{
        return res.status(200).json({ books: result });
    })
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
    let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(404).json({message: "Author not found"});
    }
    res.send(ans);
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
