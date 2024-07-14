require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// simulating a list of posts with an empty array
const posts = [];

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
    return post.username === req.user.username;
  });
  
  res.json(filteredPosts);
});

app.post('/posts', authenticateToken, (req, res) => {
  posts.push(req.body);
  res.sendStatus(201);
})

app.listen(4000);