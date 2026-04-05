import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Plus, Send, CheckCircle, Edit3, Eye, X, User, Calendar, Users } from 'lucide-react';

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });
  const [statusFilter, setStatusFilter] = useState('');
  const [viewSubmissions, setViewSubmissions] = useState(null);

  const fetchAssignments = async () => {
    try {
      const res = await API.get(`/assignments?status=${statusFilter}`);
      setAssignments(res.data.assignments);
    } catch (err) {
      console.error("Error fetching assignments");
    }
  };

 useEffect(() => {
  fetchAssignments();
}, [statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (editingId) { 
        await API.put(`/assignments/${editingId}`, payload); 
      } else { 
        await API.post('/assignments', payload); 
      }

      setEditingId(null);
      setShowForm(false);
      setFormData({ title: '', description: '', dueDate: '' });
      fetchAssignments();
    } catch (err) { 
      alert("Error saving assignment"); 
    }
  };
  const startEdit = (asg) => {
    setFormData({ title: asg.title, description: asg.description, dueDate: asg.dueDate.split('T')[0] });
    setEditingId(asg._id);
    setShowForm(true);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/assignments/${id}/status`, { status });
      fetchAssignments();
    } catch (err) { alert("Error updating status"); }
  };

  return (
    <div className="min-h-screen bg-accent-pale p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest">Teacher Dashboard</h1>
            <p className="text-primary-base font-medium text-sm md:text-base">Manage your assignments and student progress</p>
          </div>
          <button 
            onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', description: '', dueDate: '' }); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-dark text-white px-6 py-3 rounded-xl hover:bg-primary-darkest transition-all shadow-lg font-bold"
          >
            <Plus size={20} /> New Assignment
          </button>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {['', 'Draft', 'Published', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                statusFilter === status 
                ? 'bg-primary-dark text-white shadow-md' 
                : 'bg-white text-primary-dark border border-accent-light hover:bg-accent-light/10'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl mb-8 border-2 border-primary-base">
            <h2 className="text-xl font-bold text-primary-dark mb-4">{editingId ? 'Edit Draft' : 'New Assignment'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-base" 
                placeholder="Title" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea 
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-base min-h-[100px]" 
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-primary-base ml-1">Due Date</label>
                <input 
                  type="date" 
                  className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-base" 
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <button type="submit" className="flex-1 bg-secondary-dark text-white py-3 rounded-xl font-bold">
                  {editingId ? 'Update Draft' : 'Create Draft'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="py-3 px-6 border rounded-xl font-bold text-gray-500">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {assignments.map(asg => (
            <div key={asg._id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-accent-pale flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg md:text-xl font-bold text-primary-darkest line-clamp-1">{asg.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      asg.status === 'Published' ? 'bg-green-100 text-green-700' : 
                      asg.status === 'Completed' ? 'bg-primary-darkest text-white' : 'bg-gray-100 text-gray-600'
                    }`}>{asg.status}</span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">{asg.description}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  {asg.status === 'Draft' && (
                    <>
                      <button onClick={() => startEdit(asg)} className="flex-1 md:flex-none p-3 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors flex items-center justify-center"><Edit3 size={18} /></button>
                      <button onClick={() => updateStatus(asg._id, 'Published')} className="flex-[2] md:flex-none flex items-center justify-center gap-2 bg-accent-light text-primary-darkest px-4 py-3 rounded-xl font-bold hover:bg-primary-base hover:text-white transition-all text-sm"><Send size={16} /> Publish</button>
                    </>
                  )}
                  {asg.status === 'Published' && (
                    <button onClick={() => updateStatus(asg._id, 'Completed')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-dark text-white px-4 py-3 rounded-xl font-bold hover:bg-primary-darkest transition-all text-sm"><CheckCircle size={16} /> Complete</button>
                  )}
                  <button onClick={() => setViewSubmissions(asg)} className="flex-1 md:flex-none p-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center"><Eye size={18} /></button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-[11px] font-bold border-t pt-4 border-gray-50">
                <div className="flex items-center gap-1 text-primary-base"><Calendar size={14} /> Due: {new Date(asg.dueDate).toLocaleDateString()}</div>
                <div className="flex items-center gap-1 text-secondary-dark"><Users size={14} /> Submissions: {asg.submissions?.length || 0}</div>
              </div>
            </div>
          ))}
        </div>

        {viewSubmissions && (
          <div className="fixed inset-0 bg-primary-darkest/60 flex items-end md:items-center justify-center p-0 md:p-4 z-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-t-[2rem] md:rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
                <h2 className="text-xl md:text-2xl font-bold text-primary-dark">Submissions</h2>
                <button onClick={() => setViewSubmissions(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                {viewSubmissions.submissions?.map((s, i) => (
                  <div key={i} className="p-4 bg-accent-pale/20 rounded-2xl border border-accent-pale">
                    <div className="flex items-center gap-2 mb-2 font-bold text-primary-darkest text-sm"><User size={14}/> {s.student?.name || 'Student'}</div>
                    <p className="text-gray-700 italic text-sm">"{s.answer}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;