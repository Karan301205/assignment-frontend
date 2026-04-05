import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Send, CheckCircle, Clock, BookOpen, MessageSquare, History } from 'lucide-react';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [submitData, setSubmitData] = useState({ id: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchAssignments = async () => {
    try {
      const res = await API.get('/assignments');
      setAssignments(res.data.assignments);
    } catch (err) { console.error("Error fetching assignments"); }
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleSubmit = async (e, asgId) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/assignments/${asgId}/submit`, { answer: submitData.answer });
      setSubmitData({ id: '', answer: '' });
      fetchAssignments();
    } catch (err) { alert("Submission failed"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-accent-pale p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 mt-4">
          <h1 className="text-3xl font-black text-primary-darkest">Student Portal</h1>
          <p className="text-primary-base font-bold text-sm">View and submit assignments</p>
        </header>

        <div className="space-y-6">
          {assignments.length === 0 ? (
            <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-accent-light">
              <BookOpen className="mx-auto text-accent-light mb-4 opacity-40" size={48} />
              <p className="text-primary-darkest font-extrabold">No active assignments.</p>
            </div>
          ) : (
            assignments.map((asg) => {
              const mySubmission = asg.submissions?.find(s => (s.student?._id || s.student) === user?.id);
              return (
                <div key={asg._id} className="bg-white rounded-[2rem] shadow-sm border border-accent-pale overflow-hidden">
                  <div className="bg-primary-dark p-6 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold leading-tight line-clamp-1">{asg.title}</h3>
                      {mySubmission ? <CheckCircle size={22} className="text-green-400" /> : <Clock size={22} className="text-accent-light" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-white/20 px-2 py-0.5 rounded">Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-6 text-sm italic font-medium">"{asg.description}"</p>

                    {mySubmission ? (
                      <div className="bg-green-50/50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-700 font-black text-[10px] uppercase mb-2"><History size={14}/> Submitted</div>
                        <p className="text-gray-700 text-sm font-medium leading-relaxed">{mySubmission.answer}</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleSubmit(e, asg._id)} className="space-y-3">
                        <textarea
                          required
                          className="w-full p-4 border-2 border-accent-pale rounded-xl outline-none focus:border-primary-base text-sm min-h-[100px]"
                          placeholder="Type your response..."
                          value={submitData.id === asg._id ? submitData.answer : ''}
                          onChange={(e) => setSubmitData({ id: asg._id, answer: e.target.value })}
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-secondary-dark text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-darkest active:scale-[0.98] transition-all"
                        >
                          <Send size={16} /> {loading ? "Sending..." : "Submit Response"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;