import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfileCard from "../components/UserProfileCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { token, user, logout } = useAuth(); // ⬅️ Updated here
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [themeDark, setThemeDark] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [form, setForm] = useState({ subjectId: "", duration: "", notes: "" });
  const [newSubject, setNewSubject] = useState({ name: "", goalHours: "" });
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const [subjectRes, sessionRes] = await Promise.all([
          axios.get("http://localhost:5000/api/subjects", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions", {
            headers: { "x-auth-token": token },
          }),
        ]);

        setSubjects(subjectRes.data);
        setSessions(sessionRes.data);

        if (subjectRes.data.length && !form.subjectId) {
          setForm((prev) => ({ ...prev, subjectId: subjectRes.data[0]._id }));
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    fetchDashboardData();
  }, [token]);

  const toggleTheme = () => {
    const newTheme = !themeDark;
    setThemeDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeDark);
  }, [themeDark]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubjectChange = (e) =>
    setNewSubject({ ...newSubject, [e.target.name]: e.target.value });

  const handleAddOrUpdateSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.goalHours) {
      toast.error("Enter subject name and goal hours.");
      return;
    }
    try {
      if (editSubjectId) {
        await axios.put(
          `http://localhost:5000/api/subjects/${editSubjectId}`,
          newSubject,
          { headers: { "x-auth-token": token } }
        );
        toast.success("Subject updated!");
      } else {
        await axios.post("http://localhost:5000/api/subjects", newSubject, {
          headers: { "x-auth-token": token },
        });
        toast.success("Subject added!");
      }
      setNewSubject({ name: "", goalHours: "" });
      setEditSubjectId(null);
      const res = await axios.get("http://localhost:5000/api/subjects", {
        headers: { "x-auth-token": token },
      });
      setSubjects(res.data);
    } catch (err) {
      toast.error("Failed to save subject.");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
        headers: { "x-auth-token": token },
      });
      toast.success("Subject deleted.");
      const res = await axios.get("http://localhost:5000/api/subjects", {
        headers: { "x-auth-token": token },
      });
      setSubjects(res.data);
    } catch (err) {
      toast.error("Failed to delete subject.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjectId || !form.duration) {
      toast.error("Select subject and enter duration.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/sessions", form, {
        headers: { "x-auth-token": token },
      });
      toast.success("Session added!");
      setForm({ subjectId: subjects[0]?._id || "", duration: "", notes: "" });
      const res = await axios.get("http://localhost:5000/api/sessions", {
        headers: { "x-auth-token": token },
      });
      setSessions(res.data);
    } catch (err) {
      toast.error("Failed to add session.");
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/sessions/${id}`, {
        headers: { "x-auth-token": token },
      });
      toast.success("Session deleted.");
      const res = await axios.get("http://localhost:5000/api/sessions", {
        headers: { "x-auth-token": token },
      });
      setSessions(res.data);
    } catch (err) {
      toast.error("Failed to delete session.");
    }
  };

  const filteredSessions = sessions
    .filter((s) => (subjectFilter ? s.subjectId?._id === subjectFilter : true))
    .filter((s) =>
      searchQuery
        ? s.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) =>
      sortBy === "duration"
        ? b.duration - a.duration
        : new Date(b.date) - new Date(a.date)
    );

  const totalStudyTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  const barChartData = subjects.map((sub) => {
    const total = sessions
      .filter((s) => s.subjectId?._id === sub._id)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    return { name: sub.name, total };
  });

  const lineChartData = Object.entries(
    sessions.reduce((acc, s) => {
      const date = new Date(s.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (s.duration || 0);
      return acc;
    }, {})
  ).map(([date, duration]) => ({ date, duration }));

  return (
    <div className="dashboard-container">
      <div className="header-container flex items-center justify-between flex-wrap">
        <h1 className="header-title">📚 Study Dashboard</h1>
        <div className="flex gap-4 items-center">
          <button onClick={toggleTheme} className="toggle-theme-btn">
            {themeDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          {/* ⬇️ Added UserProfileCard */}
          <UserProfileCard user={user} onLogout={logout} />
        </div>
      </div>

      <p className="total-study-time">⏱️ Total Study Time: {totalStudyTime} mins</p>
 <div className="grid md:grid-cols-3 gap-4 mb-6">
        {subjects.map((subj) => (
          <div key={subj._id} className="subject-card">
            <h2 className="subject-title">{subj.name}</h2>
            <p>🎯 Goal: {subj.goalHours} hrs</p>
            <div className="subject-actions">
              <button
                className="btn-edit"
                onClick={() => {
                  setEditSubjectId(subj._id);
                  setNewSubject({ name: subj.name, goalHours: subj.goalHours });
                }}
              >
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteSubject(subj._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddOrUpdateSubject} className="subject-form">
        <input
          type="text"
          name="name"
          placeholder="Subject Name"
          value={newSubject.name}
          onChange={handleSubjectChange}
          className="form-input"
        />
        <input
          type="number"
          name="goalHours"
          placeholder="Goal Hours"
          value={newSubject.goalHours}
          onChange={handleSubjectChange}
          className="form-input"
        />
        <button className="btn-submit">
          {editSubjectId ? "Update Subject" : "Add Subject"}
        </button>
      </form>

      <form onSubmit={handleSubmit} className="session-form">
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((subj) => (
            <option key={subj._id} value={subj._id}>
              {subj.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="duration"
          placeholder="Duration (mins)"
          value={form.duration}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="form-input"
        />
        <button className="btn-session">Add Session</button>
      </form>

      <div className="filter-container">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="form-input"
        >
          <option value="">All Subjects</option>
          {subjects.map((subj) => (
            <option key={subj._id} value={subj._id}>
              {subj.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="🔍 Search notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-input"
        >
          <option value="date">Sort by Date</option>
          <option value="duration">Sort by Duration</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session._id} className="session-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="session-title">{session.subjectId?.name}</h3>
                <p>⏱️ {session.duration} mins</p>
                {session.notes && <p>📝 {session.notes}</p>}
                <p className="session-date">
                  📅 {new Date(session.date).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDeleteSession(session._id)}
                className="text-red-600 hover:text-red-800 text-xl ml-4"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">
        📊 Study Time by Subject
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3b82f6" name="Minutes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">
        📈 Study Time Over Time
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="#10b981"
              name="Minutes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;


