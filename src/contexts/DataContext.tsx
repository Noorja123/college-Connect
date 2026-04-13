import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const users = await api.getUsers();
        const students = await api.getStudents();
        const teachers = await api.getTeachers();
        const courses = await api.getCourses();
        const subjects = await api.getSubjects();
        const assignments = await api.getAssignments();
        const submissions = await api.getSubmissions();
        const attendance = await api.getAttendance();

        const normalize = (arr: any[]) => (arr || []).map(item => ({ ...item, id: item._id || item.id }));

        setData({
          MOCK_USERS: normalize(users),
          MOCK_STUDENTS: normalize(students),
          MOCK_TEACHERS: normalize(teachers),
          MOCK_COURSES: normalize(courses),
          MOCK_SUBJECTS: normalize(subjects),
          MOCK_ASSIGNMENTS: normalize(assignments),
          MOCK_SUBMISSIONS: normalize(submissions),
          MOCK_ATTENDANCE: normalize(attendance)
        });
      } catch (err: any) {
        console.error("Failed to load DB data:", err);
        setErrorMsg(err.message || String(err));
      }
    }
    loadData();
  }, []);

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-red-500 font-sans p-8">
        <h2 className="text-2xl font-bold mb-4">Database Connection Failed</h2>
        <p className="bg-neutral-800 p-4 rounded text-mono">{errorMsg}</p>
        <p className="mt-4 text-white">Please check your Express server.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold">Connecting to MongoDB Atlas...</h2>
      </div>
    );
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export const useAppDb = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAppDb must be used within DataProvider');
  return ctx;
};
