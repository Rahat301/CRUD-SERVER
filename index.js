
const express = require('express')
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express()
const port = 8000 
const cors = require('cors')
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion} = require('mongodb');
const uri = "mongodb+srv://Rahat:Gkg649fF0TsXbMzq@mongodb-1.dicfjcd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      const database = client.db("Students");
      const studentCollection = database.collection("studentCollection");


      //updateApi
      app.put('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const updatedUser = req.body;
        const filter= {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name: updatedUser.name,
            email:updatedUser.email,
           },
        };
        const result = await studentCollection.updateOne(filter, updateDoc, options);
        res.json(result);
      })

      // get api for view single students

      app.get("/users/:id",async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await studentCollection.findOne(query) 
        res.json(result)
      })


      // delete api
      app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await studentCollection.deleteOne(query)
        res.json(result)
      })

      //get api
      app.get('/users', async(req,res)=>{
        const cursor = studentCollection.find({})
        const user = await cursor.toArray();
        res.send(user);
      })
    
      //post
      app.post("/users",async(req,res)=>{
        const newUser = req.body;
        const result = await studentCollection.insertOne(newUser);
        res.json(result);
        

      })
    } finally {
     // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})