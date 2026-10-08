require('dotenv').config();
const pool=require('./src/config/db.js');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mainRoutes=require('./src/routes/mainRoutes.js');
const cors=require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://192.168.1.211:5173'
    ],
    credentials: true
}));

app.use('/api',mainRoutes);

app.get('/',(req,res)=> res.send('ok'));
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} `);
});