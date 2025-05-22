import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());

// Simple root route
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

// Port configuration
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

export default app;