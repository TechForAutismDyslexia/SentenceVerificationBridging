import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import {section1, section2} from './schema.js';

dotenv.config();

const app = express();
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Function to load data from the database
async function loadData() {
    try {
        console.log("Fetching section-1 data...");
        const section = await section1.find();
        console.log("Fetched section-1 data:", section);

        console.log("Fetching section-2 data...");
        const section3 = await section2.find();
        console.log("Fetched section-2 data:", section3);

        return { "section-1": section, "section-2": section3 };
    } catch (err) {
        console.error("Failed to fetch data:", err);
        return { error: "Failed to load data" };
    }
}

// API endpoint to fetch sections data
app.get('/api/sections', async (req, res) => {
    console.log("Received request for /api/sections");
    const data = await loadData();
    console.log("Sending data to client:", data);
    res.json(data);
});

// Define the server port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
