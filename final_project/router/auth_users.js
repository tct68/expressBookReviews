const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "thuong.truong",
        "password": "thuong.truong"
    }
];

const isValid = (username)=>{ //returns boolean
return users[0].username === username
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return true
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    const username = decoded.username;

    if (books[isbn]) {
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review;
        res.status(200).json({ message: "Review added/updated successfully" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    const username = decoded.username;

    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        res.status(200).json({ message: "Review deleted successfully" });
    } else {
        res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
