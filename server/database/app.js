const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false }));

/* ============================
   FIXED JSON FILE PATHS
   ============================ */
const reviews_data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8')
);

const dealerships_data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'dealerships.json'), 'utf8')
);

/* ============================
   MONGODB CONNECTION
   ============================ */
mongoose.connect("mongodb://localhost:27017/",  {
  dbName: 'dealershipsDB'
});

/* ============================
   MODELS
   ============================ */
const Reviews = require('./review');
const Dealerships = require('./dealership');

/* ============================
   INSERT INITIAL DATA
   ============================ */
mongoose.connection.once("open", async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);

    console.log("Database populated successfully");
  } catch (error) {
    console.log("Error populating database:", error);
  }
});

/* ============================
   ROUTES
   ============================ */

// Home
app.get('/', async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Fetch reviews by dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({
      dealership: parseInt(req.params.id)
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// ✅ Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers' });
  }
});

// ✅ Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({
      state: req.params.state
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by state' });
  }
});

// ✅ Fetch dealership by id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const document = await Dealerships.findOne({
      id: parseInt(req.params.id)
    });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer' });
  }
});

// Insert review
app.post('/insert_review', async (req, res) => {
  try {
    const documents = await Reviews.find().sort({ id: -1 });
    let new_id = documents.length > 0 ? documents[0]['id'] + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: req.body.name,
      dealership: req.body.dealership,
      review: req.body.review,
      purchase: req.body.purchase,
      purchase_date: req.body.purchase_date,
      car_make: req.body.car_make,
      car_model: req.body.car_model,
      car_year: req.body.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

/* ============================
   START SERVER
   ============================ */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
