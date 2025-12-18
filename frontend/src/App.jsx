import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: '', position: '' });

  // Fetch Jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get('https://jobhunt-backend-i61y.onrender.com/jobs');
    setJobs(res.data);
  };

  // Add Job
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.company || !form.position) return;
    await axios.post('https://jobhunt-backend-i61y.onrender.com/jobs', form);
    setForm({ company: '', position: '' });
    fetchJobs();
  };

  // Delete Job
  const handleDelete = async (id) => {
    await axios.delete(`https://jobhunt-backend-i61y.onrender.com/jobs/${id}`);
    fetchJobs();
  };

  // Update Status
  const updateStatus = async (id, currentStatus) => {
    const stages = ["Applied", "Interview", "Offer", "Rejected"];
    const currentIndex = stages.indexOf(currentStatus);
    const nextStatus = stages[currentIndex + 1] || "Applied"; // Cycle through statuses
    
    await axios.put(`https://jobhunt-backend-i61y.onrender.com/jobs/${id}`, { status: nextStatus });
    fetchJobs();
  };

  return (
    <div className="app-container">
      {/* 1. Header Section */}
      <header className="header">
        <h1>Job<span className="gradient-text">Hunt</span></h1>
        <p className="subtitle">Track your journey to the dream offer.</p>
        
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-num">{jobs.length}</span>
            <span className="stat-label">Applications</span>
          </div>
          <div className="stat">
            <span className="stat-num">{jobs.filter(j => j.status === 'Interview').length}</span>
            <span className="stat-label">Interviews</span>
          </div>
          <div className="stat">
            <span className="stat-num">{jobs.filter(j => j.status === 'Offer').length}</span>
            <span className="stat-label">Offers</span>
          </div>
        </div>
      </header>

      {/* 2. Input Section */}
      <section className="input-section">
        <form onSubmit={handleSubmit} className="glass-form">
          <input 
            type="text" 
            placeholder="Company (e.g. Netflix)" 
            value={form.company} 
            onChange={e => setForm({...form, company: e.target.value})} 
          />
          <input 
            type="text" 
            placeholder="Role (e.g. Frontend Engineer)" 
            value={form.position} 
            onChange={e => setForm({...form, position: e.target.value})} 
          />
          <button type="submit" className="btn-add">
            + Add Application
          </button>
        </form>
      </section>

      {/* 3. Job Grid */}
      <main className="job-grid">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <div className="card-header">
              <h3>{job.company}</h3>
              <button onClick={() => handleDelete(job._id)} className="btn-icon">×</button>
            </div>
            <p className="role">{job.position}</p>
            
            <div className="card-footer">
              <span 
                className={`status-badge ${job.status.toLowerCase()}`}
                onClick={() => updateStatus(job._id, job.status)}
              >
                {job.status}
              </span>
              <span className="date">{new Date(job.dateApplied).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        
        {jobs.length === 0 && (
          <div className="empty-state">
            <p>No applications yet. Start hunting!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;