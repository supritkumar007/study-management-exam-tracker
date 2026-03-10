import React from 'react';
import styles from './ExamCard.module.css';
import { formatDate, getDaysRemaining } from '../utils/dateUtils';
import { FaClock, FaBook, FaCalendarAlt, FaTrash } from 'react-icons/fa';

const ExamCard = ({ exam, onStartStudy, onDelete, isStudying }) => {
    const daysRemaining = getDaysRemaining(exam.examDate);
    const isCompleted = exam.examStatus === 'Completed';

    return (
        <div className={`${styles.card} ${isCompleted ? styles.completed : ''}`}>
            <div className={styles.header}>
                <h3>{exam.subjectName}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`${styles.badge} ${isCompleted ? styles.badgeCompleted : styles.badgeUpcoming}`}>
                        {exam.examStatus}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className={styles.deleteBtn} title="Delete Exam">
                        <FaTrash />
                    </button>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.row}>
                    <FaCalendarAlt className={styles.icon} />
                    <span>{formatDate(exam.examDate)} {daysRemaining >= 0 && !isCompleted ? `(${daysRemaining} days left)` : ''}</span>
                </div>

                <div className={styles.row}>
                    <FaBook className={styles.icon} />
                    <span>Syllabus: {exam.syllabusStatus}</span>
                </div>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <small>Planned</small>
                        <strong>{exam.studyHoursPlanned}h</strong>
                    </div>
                    <div className={styles.stat}>
                        <small>Done</small>
                        <strong>{exam.studyHoursCompleted.toFixed(1)}h</strong>
                    </div>
                    <div className={styles.stat}>
                        <small>Remaining</small>
                        <strong>{exam.remainingHours > 0 ? exam.remainingHours.toFixed(1) : 0}h</strong>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                {!isCompleted && (
                    <button
                        onClick={onStartStudy}
                        className={styles.startBtn}
                        disabled={isStudying}
                    >
                        {isStudying ? 'Studying Now... ⏱️' : 'Start Study Timer ⏱️'}
                    </button>
                )}
                {isCompleted && (
                    <span className={styles.completedText}>Exam Completed 🎉</span>
                )}
            </div>
        </div>
    );
};

export default ExamCard;
