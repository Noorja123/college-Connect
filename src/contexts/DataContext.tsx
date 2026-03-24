import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(null);

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

        setData({
          MOCK_USERS: users || [],
          MOCK_STUDENTS: students || [],
          MOCK_TEACHERS: teachers || [],
          MOCK_COURSES: courses || [],
          MOCK_SUBJECTS: subjects || [],
          MOCK_ASSIGNMENTS: assignments || [],
          MOCK_SUBMISSIONS: submissions || [],
          MOCK_ATTENDANCE: attendance || []
        });
      } catch (err) {
        console.error("Failed to load DB data:", err);
      }
    }
    loadData();
  }, []);

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
