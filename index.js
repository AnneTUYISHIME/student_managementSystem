const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/ping', (req, res) => {
    res.send('pong');
  });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
//app.use('/api/uploads', require('./routes/uploadRoutes'));
app.use('/api/cloud', require('./routes/uploadRoutes'));


console.log('Loaded /api/auth routes');

app.use('/api/students', require('./routes/studentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
