// src/components/SubjectList.jsx
const SubjectList = ({ subjects }) => {
  return (
    <div className="mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Subjects</h2>
      {subjects.length === 0 ? (
        <p>No subjects added yet.</p>
      ) : (
        <ul className="space-y-2">
          {subjects.map((subj) => (
            <li key={subj._id} className="p-2 border rounded flex justify-between">
              <span>{subj.name}</span>
              <span className="text-gray-600">{subj.goalHours} hrs</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubjectList;
