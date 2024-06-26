const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { async } = require('postcss-js');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/loginApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


const User = mongoose.model('User', userSchema);


app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

// Route to handle login form submission
app.post('/loginsuccess', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
      // console.log(req);

    const newUser = new User({
        username:username,
        password: password
      });
    
      
      try {
        await newUser.save();
        console.log('User data saved to MongoDB:', newUser);
        // res.send('Login successful!');
        res.sendFile(path.join(__dirname, 'login.html'));
      } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Error saving user data');
      }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
