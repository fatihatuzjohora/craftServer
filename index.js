const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
//-----------------------
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
//-------------------------------

app.use(cors({ origin:'*'}));
app.use(express.json());
//----------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qchb1so.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
//--------------------------

//------------------------------------------------
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //---------------------------------------------------------

    const craftCollection = client.db("craftDB").collection("craft");
    const artCollection = client.db("craftDB").collection("craftcatagoris");
    // artDB
    //-------------------------------

    app.get("/craft", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //------------------------------- extra

    app.get("/art", async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    //  console.log(result);

    });

    //-------------------------------------------------------

    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    //------------------------------------------------

    app.post("/craft", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    //--------------------------------------------------

    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          craftName: updatedCraft.craftName,
          subcategoryName: updatedCraft.subcategoryName,
          shortDescription: updatedCraft.shortDescription,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processingTime: updatedCraft.processingTime,
          stockStatus: updatedCraft.stockStatus,
          photo: updatedCraft.photo,
        },
      };
      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result);
    });


    


     //------------------------------------------------------------------

    app.delete("/craft/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });



    //----------------------------------------------------------

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("craft server is running");
});

app.listen(port, () => {
  console.log(`craft runnign port:${port}`);
});
