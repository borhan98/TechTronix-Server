const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iv66lqh.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const productCollection = client.db("productDB").collection("products");
    const brandCollection = client.db("productDB").collection('brands');

    // POST product
    app.post("/products", async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })



    // GET brand
    app.get("/brands", async (req, res) => {
        const result = await brandCollection.find().toArray();
        res.send(result);
    })
    // POST brand
    app.post("/brands", async (req, res) => {
        const brand = req.body;
        const result = await brandCollection.insertOne(brand);
        res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("TechTronix server is running...");
})

app.listen(port, () => {
    console.log(`TechTronix server is running on the port: ${port}`);
})