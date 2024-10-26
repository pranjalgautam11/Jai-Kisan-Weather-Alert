const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this to handle JSON requests
app.use(express.static('public')); // Serve static files (HTML, CSS, etc.)

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/registrationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error', error);
});

// Schema Definition
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

const farmerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  state: String,
  city: String,
  pincode: String,
  landArea: Number,
  areaUnit: String,
  gender: String,
  nearbyPanchayat: String,
  panchayatph: String,
  panchayatemail: String,
  crops: [String],
});

const Farmer = mongoose.model('Farmer', farmerSchema);

// Admin Schema Definition
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Admin = mongoose.model('Admin', adminSchema);

// Create admin credentials if not already in the database
const createAdmin = async () => {
  const adminExists = await Admin.findOne({ username: 'admin' });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin', 10); // Hash password
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword
    });

    admin.save().then(() => {
      console.log('Admin created with username: admin, password: admin');
    }).catch((error) => {
      console.error('Error creating admin:', error);
    });
  } else {
    console.log('Admin already exists');
  }
};

createAdmin();

// Route to handle signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword // Store hashed password
    });

    await newUser.save();
    res.status(200).send('Signup successful');
  } catch (error) {
    console.error('Error saving to MongoDB', error);
    res.status(500).send('Signup failed');
  }
});

// Farmer registration route (unchanged)
app.post('/register', (req, res) => {
  const cropFields = [];
  for (let i = 1; i <= req.body.numCrops; i++) {
    cropFields.push(req.body[`cropName${i}`]);
  }

  const newFarmer = new Farmer({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    state: req.body.state,
    city: req.body.city,
    pincode: req.body.pincode,
    landArea: req.body.landArea,
    areaUnit: req.body.areaUnit,
    gender: req.body.gender,
    nearbyPanchayat: req.body.nearbypanchayat,
    panchayatph: req.body.panchayatph,
    panchayatemail: req.body.panchayatemail,
    crops: cropFields,
  });

  newFarmer.save().then(() => {
    res.send('Registration successful!');
  }).catch((error) => {
    console.error('Error saving to MongoDB', error);
    res.status(500).send('Error saving registration');
  });
});

// Admin Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin) {
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (isPasswordCorrect) {
      res.redirect('/admin.html');
    } else {
      res.status(401).send('Invalid password');
    }
  } else {
    res.status(401).send('Invalid username');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
