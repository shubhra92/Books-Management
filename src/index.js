const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let url="mongodb+srv://atifpervez:34BmDa5XVvtznQvO@code.8mvlc.mongodb.net/group17-DB"

mongoose.connect(url, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});