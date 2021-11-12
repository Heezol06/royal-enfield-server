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
      // const usersCollection = database.collection('users')

      // get bike collection api 
      app.get('/bikes', async(req, res)=>{
        const cursor = bikeCollection.find({});
        const products = await cursor.toArray();
        res.json(products)
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

      //post api
      app.post('/addOrderInfo', async(req, res)=>{
        console.log(req.body);
        const result = await usersCollection.insertOne(req.body)
        res.json(result)
      })

      // get order
      app.get('/orders', async(req, res)=>{
        const result = await usersCollection.find({}).toArray()
        res.json(result);
      })

      //delete order
      app.delete('/deleteOrder/:id', async(req, res)=>{
        const id = req.params.id;
        const order = {_id:ObjectId(id)}
        const result = await usersCollection.deleteOne(order)
        req.json(result.acknowledged)
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