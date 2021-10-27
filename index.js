const express=require('express');
const { MongoClient } = require('mongodb');
const cors=require('cors');
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;


// DB_USER=geniusMechanics
// DB_PASS=pkRaUNg493duO2x8


const uri = `mongodb+srv://${process.env.DB_USER}:${ process.env.DB_PASS}@cluster0.pihjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app=express();
const port= process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

// console.log(uri);


async function run(){
    try{
        await client.connect();
        console.log('database connect');
        const database=client.db('carMechanic')
        const servicesCollection=database.collection('services')

        // API POST
        app.post('/services',async (req,res)=>{
        
           const service=req.body;
           console.log('hitting the post',service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        // get api
        app.get('/services', async(req,res)=>{
            const cursor= servicesCollection.find({})
            const services=await cursor.toArray();
            res.send(services)
        })

        // get singel api service
        app.get('/services/:id', async(req,res)=>{
              const id=req.params.id;
              const query={_id:ObjectId(id)}
              const result= await servicesCollection.findOne(query)
              res.json(result);
        })

        // DELETE API
        app.delete('/services/:id', async (req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)}
            const result=await servicesCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running genius car mechanics server')
})

app.listen(port,()=>{
    console.log('genius car mechanics server running port is',port)
})
