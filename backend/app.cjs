const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const route = require('../backend/routes/teachers.route.cjs');
const cors = require('cors');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('API server started on: ' + port);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin: '*'
}));

route(app);
