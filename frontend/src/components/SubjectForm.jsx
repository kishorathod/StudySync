// src/components/SubjectForm.jsx
import { useState } from 'react';
import axios from 'axios';

const SubjectForm = ({ fetchSubjects }) => {
  const [name, setName] = useState('');
  const [goalHours, setGoalHours] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length < 3) return alert("Name must be at least 3 characters");

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/subjects', {
        name,
        goalHours: parseInt(goalHours)
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      setName('');
      setGoalHours('');
      fetchSubjects(); // refresh list after adding
    } catch (err) {
      console.error(err);
      alert("Error adding subject");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Add Subject</h2>
      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="Subject Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="w-full p-2 border rounded"
        type="number"
        placeholder="Goal Hours"
        value={goalHours}
        onChange={(e) => setGoalHours(e.target.value)}
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Add Subject</button>
    </form>
  );
};

export default SubjectForm;
