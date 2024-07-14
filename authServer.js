require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const users = [];
let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
};

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);  
    }

    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken })
  });
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      username: req.body.username,
      password: hashedPassword
    };
    users.push(user);
    res.status(201).send();

  } catch (e) {
    res.status(500).send();
  }
});

app.delete('/users/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

app.post('/users/login', async (req, res) => {
  const username = req.body.username;
  const user = users.find((user) => { 
    return user.username === username 
  });
  if (!user) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) { 
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      
      res.json({ accessToken, refreshToken });
      refreshTokens.push(refreshToken);

      res.send('Success');
    } else {
      res.send('Not Allowed');
    }
  } catch (e) {
    res.status(500).send();
  }
});

app.listen(2000);