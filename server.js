const app  = require('./app');
require('dotenv').config({ path: ".env"});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to Database');
})
.catch((error) => {
    console.log("Connection error: "+ error);
});

const port = process.env.PORT;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;