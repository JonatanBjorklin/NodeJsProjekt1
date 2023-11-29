const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(__dirname));

server.set('port', process.env.PORT || 999);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ dest: 'img/' });

server.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

server.get('/create', (request, response) => {
  response.sendFile(__dirname + '/create.html');
});

server.get('/edit', (request, response) => {
  response.sendFile(__dirname + '/edit.html');
});

server.get('/list', (request, response) => {
  response.sendFile(__dirname + '/list.html');
});

server.post('/create', upload.single('userImage'), (request, response) => {
  const { firstName, lastName, username, birthday, work } = request.body;
  const userImage = request.file ? request.file.filename : null;

  const newUser = {
    firstName,
    lastName,
    username,
    birthday,
    work,
    userImage,
  };

  let users = [];
  try {
    const usersData = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(usersData);
  } catch (error) {
    console.error('Error reading users.json file:', error);
  }

  users.push(newUser);

  fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Error writing to users.json file:', err);
    }
  });

  response.sendFile(__dirname + '/create.html');
});

server.post('/edit', upload.single('userImage'), (request, response) => {
  const { username, firstName, lastName, birthday, work } = request.body;
  const userImage = request.file ? request.file.filename : null;

  let users = [];
  try {
    const usersData = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(usersData);
  } catch (error) {
    console.error('Error reading users.json file:', error);
  }

  const userIndex = users.findIndex((user) => user.username === username);

  if (userIndex !== -1) {
    users[userIndex].firstName = firstName;
    users[userIndex].lastName = lastName;
    users[userIndex].birthday = birthday;
    users[userIndex].work = work;
    if (userImage) {
      users[userIndex].userImage = userImage;
    }

    fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error writing to users.json file:', err);
      }
    });

    response.redirect('/list'); 
  } else {
    response.status(404).send('User not found');
  }
});

const data = fs.readFileSync('users.json', 'utf8');
const users = JSON.parse(data);

server.get('/displayUsers', (req, res) => {
  res.json(users);
});

server.listen(999, () => {
  console.log('Express server started at port 999');
});
