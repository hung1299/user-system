const express = require('express');
require('./config/db');
const userRoute = require('./src/routes/user');

const app = express();

app.use(express.json());

app.use('/users', userRoute);

app.get('/', (req, res) => {
  res.json({ msg: 'Hello' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
