const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const teacherRoute = require('../backend/routes/teachers.route.cjs');
const cors = require('cors');

const port = 3000;

app.listen(port, () => {
  console.log('API server started on: ' + port);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin: '*'
}));

app.use('/teachers', teacherRoute);
