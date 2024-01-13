const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); 
const db = require('./db');
const bodyParser = require('body-parser');
const morgan = require('morgan')
require('dotenv').config();

const app = express();
const cors = require('cors');

app.use(morgan('combined'));
// app.use(bodyParser.json());
app.use(cors(
  {
    origin: "https://socialise-seven.vercel.app",
    methods: ["POST", "GET"],
    credentials: true
  }
));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(session({
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    if (!user.validatePassword(password)) { return done(null, false); }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const userRouter = require('./routes/users');
app.use("/api/user", userRouter);

const postRouter = require('./routes/posts');
app.use('/api/posts', postRouter);

const friendRouter = require('./routes/friendRoutes');
app.use('/api/friends', friendRouter);

const displayPictureRoutes = require('./routes/displayPictureRoutes');
app.use('/api/display-pictures', displayPictureRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api', notificationRoutes);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {                       
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));                               
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
