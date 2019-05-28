const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const fileupload = require('express-fileupload');


app.use(fileupload());

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const databaseName = "addfit"
mongoose
  .connect(`mongodb://localhost/${databaseName}`, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    //console.log("Successfully connected to 'contactapp' database in MongoDB")
    console.log(`Sucessfully connected to the database's name [${databaseName}]`)
  })
  .catch(err => {
    //console.log(err)
    console.log(err);
  })

//Passport Middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

const port = 5000;

app.use(express.static(__dirname + "/public"));

//set view engine to EJS
app.set('view engine', 'ejs');

//load Database
const User = require('./models/User');

app.get('/', (req,res) => {
  res.render('pages/index')
})

app.get('/register', (req, res) => {
  res.render('pages/register')
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.get('/home', (req,res) => {
  res.render('pages/home')
})

app.get('/profile', (req, res) => {
  res.render('pages/profile')
})

app.get('/profile/:userId', (req, res) => {
  User.findById(req.params.userId).select("firstName lastName gender phone height weight profilePicture")
    .then(userData => {
      console.log(userData);
      res.render('pages/inspectProfile', {inspectData:userData})
    })
    .catch(err => {
      res.status(404).json({user: "User not found"})
    })
  //res.render('pages/inspectProfile')
})

app.get('/bmi', (req, res) => {
  res.render('pages/bmi')
})

app.get('/exerciser', (req, res) => {
  User.find().select("firstName lastName bmi gender").exec()
    .then(users => {
      //console.log(users);
      res.render('pages/exerciser', {users});
    })

  //res.render('pages/exerciser');
})

app.get('/bmiResult/:height/:weight/:result', (req, res) => {
  res.render('pages/bmiResult', { height: req.params.height, weight: req.params.weight, result: req.params.result})
})


app.get('/fitness', (req, res) => {
  res.render('pages/fitness')
})

app.post("/upload", passport.authenticate('jwt', { session: false }),function (req, res, next) {
  const file = req.files.photo;
  console.log(file);
  const currentDate = Date.now(); 
  const finalPath = './public/images/user/' + currentDate + "-" + file.name;
  const finalPathFixed = '/images/user/' + currentDate + "-" + file.name;
  file.mv(finalPath, function (err, result) {
    if (err){
      //throw err;
      res.status(400).json({error:"error occurs"})
    }
      
    User.findById(req.user.id)
      .then(userData => {
        userData.profilePicture = finalPathFixed;
        userData.save().then(() => {
          res.json({ sucess: "true", message: "file uploaded", path: finalPath, pathFixed: finalPathFixed })
        })
        .catch(err => {
          res.json(err)
        })
      })
      .catch(err => {
        res.status(400).json(err)
      })

    //res.json({ sucess: "true", message: "file uploaded", path: finalPath, pathFixed: finalPathFixed})
  })
})

//load route
const userRoute = require('./routes/api/user');
app.use('/api/user', userRoute);

app.get('/*', (req, res) => {
  res.render('pages/404')
})


app.listen(port, () => {
    console.log(`Server currently running on port ${port}`);
})