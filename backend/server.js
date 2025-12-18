const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Define the Schema (Structure of our Data)
const jobSchema = new mongoose.Schema({
    company: String,
    position: String,
    status: { type: String, default: "Applied" }, // Applied, Interview, Offer, Rejected
    dateApplied: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

// --- API ROUTES ---

// 1. GET all jobs
app.get('/jobs', async (req, res) => {
    const jobs = await Job.find().sort({ dateApplied: -1 });
    res.json(jobs);
});

// 2. POST a new job
app.post('/jobs', async (req, res) => {
    const { company, position, status } = req.body;
    const newJob = new Job({ company, position, status });
    await newJob.save();
    res.json(newJob);
});

// 3. DELETE a job
app.delete('/jobs/:id', async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
});

// 4. UPDATE a job status
app.put('/jobs/:id', async (req, res) => {
    const { status } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedJob);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));