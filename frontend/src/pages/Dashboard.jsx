import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ExamCard from '../components/ExamCard';
import AddExamModal from '../components/AddExamModal';
import StudyTimer from '../components/StudyTimer';
import styles from './Dashboard.module.css';
import { getDaysRemaining } from '../utils/dateUtils';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [exams, setExams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeExam, setActiveExam] = useState(null);

    useEffect(() => {
        fetchExams();
    }, [user]);

    const fetchExams = async () => {
        try {
            const res = await api.get('/study/my-records');
            setExams(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartStudy = (exam) => {
        if (activeExam) {
            toast.warning("You are already studying for an exam! Stop it first.");
            return;
        }
        setActiveExam(exam);
    };

    const handleStopStudy = async (studiedSeconds) => {
        if (!activeExam) return;

        // Convert seconds to hours (float)
        const studiedHours = studiedSeconds / 3600;

        // Calculate new values
        const newCompleted = activeExam.studyHoursCompleted + studiedHours;
        let newremaining = activeExam.studyHoursPlanned - newCompleted;
        if (newremaining < 0) newremaining = 0;

        try {
            await api.put(`/study/update/${activeExam._id}`, {
                studyHoursCompleted: newCompleted,
                remainingHours: newremaining
            });

            setActiveExam(null);
            fetchExams();
            toast.success(`Session recorded! +${(studiedHours).toFixed(2)} hrs`);

        } catch (err) {
            console.error(err);
            toast.error("Failed to save progress");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        try {
            await api.delete(`/study/delete/${id}`);
            toast.success("Exam deleted successfully");
            fetchExams();
        } catch (err) {
            toast.error("Failed to delete exam");
        }
    };

    // Sort exams: Upcoming first, then by date proximity
    const sortedExams = [...exams].sort((a, b) => {
        if (a.examStatus === 'Upcoming' && b.examStatus === 'Completed') return -1;
        if (a.examStatus === 'Completed' && b.examStatus === 'Upcoming') return 1;

        const dateA = new Date(a.examDate);
        const dateB = new Date(b.examDate);
        return dateA - dateB;
    });

    const alerts = sortedExams.filter(exam => {
        const days = getDaysRemaining(exam.examDate);
        return exam.examStatus === 'Upcoming' && days <= 10 && days >= 0;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <div className={styles.header}>
                <div>
                    <h2>My Dashboard 📊</h2>
                    {user && <p style={{ color: '#666', marginTop: '5px' }}>Welcome back, <strong>{user.name}</strong>!</p>}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    ➕ Add New Exam
                </button>
            </div>

            {alerts.length > 0 && (
                <div className={styles.alertsSection}>
                    {alerts.map(exam => {
                        const days = getDaysRemaining(exam.examDate);
                        let alertText = `Exam in ${days} days`;
                        if (days === 0) alertText = "Exam Today! 🚨";
                        else if (days === 1) alertText = "Exam Tomorrow! ⚠️";

                        return (
                            <div key={exam._id} className={`${styles.alertCard} ${days <= 3 ? styles.urgent : ''}`}>
                                <strong>{exam.subjectName}</strong>: {alertText}
                            </div>
                        );
                    })}
                </div>
            )}

            {activeExam && (
                <StudyTimer
                    exam={activeExam}
                    onStop={handleStopStudy}
                />
            )}

            <div className={styles.grid}>
                {sortedExams.map(exam => (
                    <ExamCard
                        key={exam._id}
                        exam={exam}
                        onStartStudy={() => handleStartStudy(exam)}
                        onDelete={() => handleDelete(exam._id)}
                        isStudying={activeExam?._id === exam._id}
                    />
                ))}
                {sortedExams.length === 0 && <p>No exams found. Add one to get started!</p>}
            </div>

            <AddExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onExamAdded={fetchExams}
            />
        </div>
    );
};

export default Dashboard;
