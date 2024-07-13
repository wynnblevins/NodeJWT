require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// dummy data
const posts = [
  {
    username: 'Bob',
    title: 'Post 1'
  },
  {
    username: 'Tom',
    title: 'Post 2'
  }  
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.send(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

app.get('/posts', authenticateToken, (req, res) => {
  const filteredPosts = posts.filter((post) => {
    return post.username === req.user.name;
  });
  
  res.json(filteredPosts);
});

app.listen(4000);