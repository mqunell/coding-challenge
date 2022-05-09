import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verify from './api/verify';

// Create the Express app and add middleware
const app = express();
app.use(cors());
app.use(express.json());

// Connect the API routers
app.use('/api', verify);

// Read environment variables
dotenv.config();
const { PORT } = process.env;

// Start the server process
const port = PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));
