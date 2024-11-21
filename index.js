const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URL;

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
    const frontEndSkillsCollection = client
      .db("portfolio")
      .collection("front-end-skills");
    const backendSkillsCollection = client
      .db("portfolio")
      .collection("backend-skills");
    const othersSkillsCollection = client
      .db("portfolio")
      .collection("others-skills");
    const projectsCollection = client.db("portfolio").collection("projects");
    const blogsCollection = client.db("portfolio").collection("blogs");

    // Get Requests

    // Skills requests
    app.get("/skills/frontend", async (req, res) => {
      const result = await frontEndSkillsCollection.find().toArray();
      res.send(result);
    });

    app.get("/skills/backend", async (req, res) => {
      const result = await backendSkillsCollection.find().toArray();
      res.send(result);
    });

    app.get("/skills/others", async (req, res) => {
      const result = await othersSkillsCollection.find().toArray();
      res.send(result);
    });

    // Projects Requests
    app.get("/projects", async (req, res) => {
      const result = await projectsCollection.find().toArray();
      res.send(result);
    });

    // get a project using id
    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const project = await projectsCollection.findOne(query);
      res.send(project);
    });

    // Blog Requests
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });

    // get a blog using id
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await toyCollection.findOne(query);
      res.send(blog);
    });

    // POST Requests
    // add skills
    app.post("/skills/frontend", async (req, res) => {
      const skills = req.body;
      const result = await frontEndSkillsCollection.insertOne(skills);
      res.send(result);
    });

    app.post("/skills/backend", async (req, res) => {
      const skills = req.body;
      const result = await backendSkillsCollection.insertOne(skills);
      res.send(result);
    });

    app.post("/skills/others", async (req, res) => {
      const skills = req.body;
      const result = await othersSkillsCollection.insertOne(skills);
      res.send(result);
    });

    // Add Project
    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectsCollection.insertOne(project);
      res.send(result);
    });

    // Add Blog
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });

    // Patch Requests

    // update a project info
    app.patch("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      try {
        const update = {
          $set: {
            ...req.body,
          },
        };

        const result = await projectsCollection.updateOne(
          filter,
          update,
          options
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error updating project" });
      }
    });

    // update a project info
    app.patch("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      try {
        const update = {
          $set: {
            ...req.body,
          },
        };

        const result = await blogsCollection.updateOne(filter, update, options);

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error updating blog" });
      }
    });

    // Delete requests
    app.delete("/skills/frontend/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await frontEndSkillsCollection.deleteOne(query);

      res.send(result);
    });
    app.delete("/skills/backend/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await backendSkillsCollection.deleteOne(query);

      res.send(result);
    });
    app.delete("/skills/others/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await othersSkillsCollection.deleteOne(query);

      res.send(result);
    });

    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await projectsCollection.deleteOne(query);

      res.send(result);
    });

    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await blogsCollection.deleteOne(query);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Portfolio backend is running");
});

app.listen(port, () => {
  console.log(`portfolio website is running on port ${port}`);
});
