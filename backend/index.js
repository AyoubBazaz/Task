const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./Router/Router');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/app')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use(router);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
