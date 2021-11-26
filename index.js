const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knq90.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database1 = client.db('helitour');
        const tourCollection = database1.collection('tours');
        const bookingCollection = database1.collection('bookings');
        
        
  // My Bookings
  app.get("/myBookings/:email", async (req, res) => {
    const result = await bookingCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });


  // add Tour
  app.post("/addTour", async (req, res) => {
    console.log(req.body);
    const result = await tourCollection.insertOne(req.body);
    console.log(result);
  });

  

  // get all tours

  app.get("/allTours", async (req, res) => {
    const result = await tourCollection.find({}).toArray();
    res.send(result);
  });

    // get all bookings 

  app.get("/allBookings", async (req, res) => {
    console.log(req.body);
    const result = await bookingCollection.find({}).toArray();
    res.send(result);
  });

  // tour item    

  app.get("/touritem/:_id", async (req, res) => {
    const result = await tourCollection.find({
      _id: ObjectId(req.params._id),
    }).toArray();
    res.send(result);
  });

  // add booking     
  app.post("/addBooking", async (req, res) => {
    console.log(req.body);
    const result = await bookingCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });



  // delete booking  

  app.delete("/deleteBooking/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await bookingCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  // Update Booking Status   
  app.put("/approveBooking/:id", async (req, res) => {
      const qury={_id: ObjectId(req.params.id)};
      const update = {$set:req.body}
    console.log(qury);
    console.log(update);
    const result = await bookingCollection.updateOne(qury,update,{ upsert: true });
    res.send(result);
    console.log(result);
  });

    }
    finally {
        // await client.close();    
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Helitour server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})