const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const checkAuth = require('./middleware/checkAuth');
const bodyParser = require('body-parser')

const userRout = require('./routes/users');
const postRout = require('./routes/post');
const categoryRout = require('./routes/category');
const signUpload = require('./routes/signUpload');
const path = require('path')

let cors = require("cors");

dotenv.config();


//Connect DB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
})



//Middleware
app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));
app.use(morgan("dev"));

app.use(cors());

app.use('/uploads', express.static('uploads'));


//Routes
app.use('/api/post/' ,postRout); // you can put to a main rout ( , checkAuth , ) for auth
app.use('/api/category/' ,categoryRout); // you can put to a main rout ( , checkAuth , ) for auth
app.use('/api/sign/' ,signUpload); // you can put to a main rout ( , checkAuth , ) for auth
app.use('/api/users/',userRout); // you can put to a main rout ( , checkAuth , ) for auth

//Cors
app.use((req, res, next) => {
//Header
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type,Accept,Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();


});



//middleWare that manage all the errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

})

//heroku
app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});




app.listen(process.env.PORT || 5000, ()=>{
    console.log('Server is running...')
});


module.exports = app;
