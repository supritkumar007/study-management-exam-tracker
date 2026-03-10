const mongoose = require('mongoose');

const StudyRecordSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    examDate: {
        type: Date,
        required: true,
    },
    syllabusStatus: {
        type: String,
        required: true, // e.g., 'Not Started', 'In Progress', 'Completed'
    },
    studyHoursPlanned: {
        type: Number,
        required: true,
    },
    studyHoursCompleted: {
        type: Number,
        default: 0,
    },
    remainingHours: {
        type: Number,
        required: true,
    },
    examStatus: {
        type: String, // 'Upcoming' or 'Completed'
        default: 'Upcoming',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('StudyRecord', StudyRecordSchema);
