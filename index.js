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
    const cartCollection = client.db("productDB").collection("cart");

    
    /*--------------- Products related program ----------------*/
    // GET products from products
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    })

    app.get("/products/:brandName", async (req, res) => {
      const brand = req.params.brandName;
      const query = {brandName: brand};
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })
    app.get("/products/:brandName/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    // POST product to products
    app.post("/products", async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    // PUT product
    app.put("/products/:brandName/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true};
      const updatedProduct = {
        $set: {
          name: product.name,
          brandName: product.brandName,
          price: product.price,
          type: product.type,
          rating: product.rating,
          image: product.image,
        }
      };
      const result = await productCollection.updateOne(filter, updatedProduct, options);
      res.send(result);
    })


    /*--------------- My Cart related program ----------------*/
    // GET Product from the cart
    app.get("/cart", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    })

    // POST product to the cart
    app.post("/cart", async (req, res) => {
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.send(result);
    })
    
    // DELETE product from the cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
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