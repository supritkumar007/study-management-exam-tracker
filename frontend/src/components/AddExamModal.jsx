import React, { useState } from 'react';
import styles from './AddExamModal.module.css';
import { toast } from 'react-toastify';
import api from '../services/api';

const AddExamModal = ({ isOpen, onClose, onExamAdded }) => {
    const [formData, setFormData] = useState({
        subjectName: '',
        examDate: '',
        studyHoursPlanned: '',
    });

    if (!isOpen) return null;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Default syllabusStatus handled by backend
            await api.post('/study/add', formData);
            toast.success('Exam Added Successfully! 📅');
            onExamAdded();
            onClose();
            setFormData({
                subjectName: '',
                examDate: '',
                studyHoursPlanned: '',
            });
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to add exam');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Add New Exam ➕</h3>
                <form onSubmit={onSubmit}>
                    <div className={styles.formGroup}>
                        <label>Subject Name</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Exam Date</label>
                        <input
                            type="date"
                            name="examDate"
                            value={formData.examDate}
                            onChange={onChange}
                            required
                        />
                    </div>
                    {/* Syllabus Status removed - auto defaults to Not Started */}
                    <div className={styles.formGroup}>
                        <label>Planned Study Hours</label>
                        <input
                            type="number"
                            name="studyHoursPlanned"
                            value={formData.studyHoursPlanned}
                            onChange={onChange}
                            required
                            min="1"
                        />
                    </div>
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Add Exam
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExamModal;
