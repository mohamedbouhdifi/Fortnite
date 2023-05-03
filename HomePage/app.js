const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost/myapp';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

/*app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
  
    const user = new User({ name, email, password })
}*/
  


  