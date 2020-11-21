const express =  require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const apiRouter = require('./routes');
const cors = require("cors");
const app = express();
app.use(cors());
require('dotenv').config();

app.use(express.json());
app.use(fileUpload());

app.use('/api/user', apiRouter.User);
app.use('/api/product', apiRouter.Product);

app.use(express.static(path.resolve(__dirname, 'client', 'build')));
// app.use('/static', express.static(path.resolve(__dirname, 'client', 'build', 'static')));
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname,  'client', 'build', 'index.html'));
});





app.listen(process.env.PORT || '4000', () => {
    console.log('server is running')
});