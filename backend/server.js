require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://simple-task-mgmt.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'], // Specify allowed headers
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/admin', require('./routes/admin'));

connectDB();

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(process.env.PORT, () => console.log(`Server Listening on ${process.env.PORT}`))