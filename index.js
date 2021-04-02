const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');

const app = express()
require('dotenv').config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello world')
  console.log("iam back ");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdpza.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);
  const booksCollection = client.db("book-house").collection("books");
  
  app.get('/books', (req, res)=>{
    booksCollection.find()
    .toArray((err, books) => {
      res.send(books);
    })
  })


  app.get('/book/:bookId', (req, res)=>{
    booksCollection.find({_id: ObjectId(req.params.bookId)})
    .toArray((err, documents)=> {
      console.log(documents);
      res.send(documents[0]);
    })
  })


  app.post('/addBook', (req, res) =>{
    const newBook = req.body;
    console.log('adding new book',newBook);
    booksCollection.insertOne(newBook)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  // app.post('/allOrders', (req, res) => {
  //   const orderedBook = req.body;
  //   booksCollection.insertOne(orderedBook)
  //   .then(result => {
  //     console.log(result.insertedCount);
  //     res.send(result.insertedCount > 0);
  //   })
  // })


});


app.listen(port);