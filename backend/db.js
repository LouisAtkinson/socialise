require('dotenv').config();

const mongoose = require('mongoose');

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.DATABASE_URL, dbOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

module.exports = mongoose.connection;
