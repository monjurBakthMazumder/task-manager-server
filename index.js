const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.ib5iccz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const listCollection = client.db("taskManagerBD").collection("list");

    app.get("/lists", async (req, res) => {
      const email = req.query?.email;
      const status = req.query?.status;
      const query = {
        email,
        status,
      };
      const result = await listCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/lists", async (req, res) => {
      const list = req.body;
      console.log(list);
      const result = await listCollection.insertOne(list);
      res.send(result);
    });

    app.delete("/lists/:id", async (req, res) => {
      const id = req.params?.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await listCollection.deleteOne(cursor);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
