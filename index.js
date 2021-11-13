const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000 

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihnag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
      await client.connect();
      const database = client.db('royal-enfield');
      const bikeCollection = database.collection('bikes');
      const loginUsersCollection = database.collection('loginUsers')

      // get bike collection api 
      app.post('/bikes', async(req, res)=>{
        console.log(req.body);
        const products = await bikeCollection.insertOne(req.body);
        res.json(products)
      })

      // get bike collection api 
      app.get('/bikes', async(req, res)=>{
        const cursor = bikeCollection.find({});
        const products = await cursor.toArray();
        res.json(products)
      })

      app.delete('/bikes/:id', async(req, res)=>{
        const id = req.params.id;
        const order = {_id:ObjectId(id)}
        const result = await bikeCollection.deleteOne(order)
        res.json(result.acknowledged)
      })

      //get single products
      app.get('/bikes/:id', async(req, res)=>{
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = {_id:ObjectId(id)}
        const service = await bikeCollection.findOne(query);
            res.json(service);

      })

      //user collection 
      const userDatabase = client.db('royal-enfield')
      const usersCollection = userDatabase.collection('users')

      //post order
      app.post('/addOrderInfo', async(req, res)=>{
        console.log(req.body);
        const result = await usersCollection.insertOne(req.body)
        res.json(result)
      })

      // get order
      app.get('/orders', async(req, res)=>{
        const result = await usersCollection.find({}).toArray()
        res.json(result);
        console.log(result);
      })
      //delete order
      app.delete('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const order = {_id:ObjectId(id)}
        const result = await usersCollection.deleteOne(order)
        res.json(result.acknowledged)
      })

      // make amdin 
      app.put('/orders')

      //user review collection
      const reviewDatabase = client.db('royal-enfield')
      const reviewCollection = reviewDatabase.collection('review')

      // post review 
      app.post('/addReview', async(req, res) => {
        console.log(req.body)
        const result = await reviewCollection.insertOne(req.body)
        res.json(result)
        console.log(result);
      })

      //get review
      app.get('/review', async(req , res) =>{
        const result = await reviewCollection.find({}).toArray()
        res.json(result);
        console.log('got result', result);
      })

      //checking admin or not 
      app.get('/users/:email', async(req, res)=>{
        const email = req.params.email;
        const query = {email: email};
        const user = await loginUsersCollection.findOne(query)
        let isAdmin = false;
        if (user?.role === 'admin') {
          isAdmin = true;
        }
        res.json({admin: isAdmin});
      })

      // login user 
      app.post('/users', async(req , res)=>{
        const user = req.body;
        console.log(user);
        const result = await loginUsersCollection.insertOne(user);
        res.json(result)
          console.log(result);
      })

      // update rote
      app.put('/users/admin', async (req, res) =>{
        const user = req.body;
        console.log(user);
        const filter = {email: user.email};
        const updateDoc = {$set:{role: 'admin'}};
        const result = await loginUsersCollection.updateOne(filter, updateDoc)
        res.json(result)
        console.log(result);
      }) 
      
  }
  finally{
        // await client.close();
  }


}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from royal server!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})