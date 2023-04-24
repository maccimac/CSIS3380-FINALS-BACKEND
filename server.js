// Declare endpoints
const DB_NAME = "300352913-jennifer"
const API_ENDPOINT = "mongodb+srv://macci:macci@clusterdouglas.9f6w02l.mongodb.net/" + DB_NAME;


// Imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;


// CREATE SCHEMA
const BookSchema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    description: {type: String}
});
const Book =  mongoose.model('Book', BookSchema);

// Parse JSON requests
app.use(bodyParser.json());

// Ensure no cor issue
app.use(cors())

// Connect to MongoDB
mongoose.connect(API_ENDPOINT, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB!');
});

app.get('/', function(req, res) {
    Book.find({}, function(err, books) {
      if (err) throw err;
      res.send(books);
    });
});

app.get('/:id', function(req, res) {
  if (req.params.id === 'favicon.ico') {
    return res.status(204).end();
  }
    Book.findOne({_id: req.params.id}, function(err, book) {
      if (err) throw err;
      res.send(book);
    });
});

// // Create a new book
app.post('/', function(req, res) {
  const book = new Book({
    title: "This is a Book Title",
    author: "Anne Author",
   description: "Lorem ipsum dolor sit amet"
  });
    // const book = new Book(req.body)

  book.save(function(err) {
    if (err) throw err;
    res.send('Book created.');
  });
})

// Update an existing book
app.put('/:id', function(req, res) {
    Book.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, book) {
      if (err) throw err;
      res.send(book);
    });
});

// Delete book
app.delete('/:id', (req, res) => {
    Book.findOneAndDelete({_id: req.params.id}, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting book from database');
      }
      else {
        res.send(result);
      }
    });
});


// Start the server
const port = 5000;
app.listen(port, function() {
  console.log(`Server is running on port: ${port}`);
});