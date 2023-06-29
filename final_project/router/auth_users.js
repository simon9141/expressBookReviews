const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  const validUsernameRegex = /^[a-zA-Z0-9]{3,}$/;
  return validUsernameRegex.test(username);
}

const authenticatedUser = (username,password)=>{
  const storedCredentials = {
    username: 'admin',
    password: 'password123'
  };

  if (username === storedCredentials.username && password === storedCredentials.password) {
    return true;
  } else {
    return false;
  }
}

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the user is registered
  if (!isRegisteredUser(username)) {
    return res.status(401).json({ message: "User not registered." });
  }

  // Authenticate the user
  if (authenticatedUser(username, password)) {
    // Generate a JWT token with the user information
    const token = jwt.sign({ username: username }, 'your-secret-key');

    // Set the token as a cookie in the response
    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({ message: 'Login successful.' });
  } else {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books.find((book) => book.isbn === isbn);

  // If the book is found, add the review to its reviews array
  if (book) {
    book.reviews.push(review);
    return true;
  }

  return false; // Book not found
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; // Assuming the username is stored in the session

  // Find the book with the provided ISBN
  const book = books.find((book) => book.isbn === isbn);

  // If the book is found, filter and delete the review(s) by the session username
  if (book) {
    const originalReviewsCount = book.reviews.length;

    // Filter and keep only the reviews written by the session user
    book.reviews = book.reviews.filter((review) => review.username !== username);

    // Check if any reviews were deleted
    if (book.reviews.length < originalReviewsCount) {
      return res.status(200).json({ message: "Book review(s) deleted successfully." });
    } else {
      return res.status(404).json({ message: "No reviews found for the given book and user." });
    }
  }

  return res.status(404).json({ message: "Book not found." });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
