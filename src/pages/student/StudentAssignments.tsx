import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';
import { Download, Upload, CheckCircle } from 'lucide-react';

const StudentAssignments: React.FC = () => {
  const { user } = useAuth();
  const student = MOCK_STUDENTS.find(s => s.userId === user?.id);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  // Filter assignments for student's course
  const assignments = MOCK_ASSIGNMENTS.filter(a => {
    const sub = MOCK_SUBMISSIONS.find(s => s.assignmentId === a.id && s.studentId === student?.id);
    return a.isActive;
  });

  const getSubmission = (assignmentId: string) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    return MOCK_SUBMISSIONS.find(s => s.assignmentId === assignmentId && s.studentId === student?.id);
  };

  const handleSubmit = (assignmentId: string) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    setSubmitted({ ...submitted, [assignmentId]: true });
  };

  return (
    <DashboardLayout>
      <h1 className="page-title mb-6">My Assignments</h1>

      <div className="space-y-4">
        {assignments.map(a => {
          const sub = getSubmission(a.id);
          const isSubmitted = submitted[a.id] || !!sub;
          return (
            <div key={a.id} className="bg-card rounded-xl shadow-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                    <span className="badge-active">{a.subject}</span>
                    <span>Due: {a.dueDate}</span>
                    <span>Marks: {a.totalMarks}</span>
                    <span>By: {a.teacherName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>

                {sub?.status === 'graded' ? (
                  <div className="flex items-center gap-2">
                    <span className="badge-graded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Graded: {sub.grade}/{a.totalMarks}
                    </span>
                    {sub.feedback && <span className="text-xs text-muted-foreground">— {sub.feedback}</span>}
                  </div>
                ) : isSubmitted ? (
                  <span className="badge-submitted flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Submitted
                  </span>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:opacity-90 transition-opacity cursor-pointer">
                    <Upload className="w-4 h-4" /> Submit PDF
                    <input type="file" accept=".pdf" className="hidden" onChange={() => handleSubmit(a.id)} />
                  </label>
                )}
              </div>
            </div>
          );
        })}

        {assignments.length === 0 && (
          <div className="bg-card rounded-xl shadow-card p-12 text-center text-muted-foreground">
            No assignments available.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
