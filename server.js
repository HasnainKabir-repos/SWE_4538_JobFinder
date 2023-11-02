const app  = require('./app');
require('dotenv').config({ path: ".env"});


const port = process.env.PORT;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;