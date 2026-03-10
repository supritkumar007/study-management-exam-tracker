const StudyRecord = require('../models/StudyRecord');

// @route   POST /api/study/add
// @desc    Add a new exam/study record
// @access  Private
exports.addRecord = async (req, res) => {
    const { subjectName, examDate, studyHoursPlanned } = req.body;

    // Validation
    if (!subjectName || !examDate || !studyHoursPlanned) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const examDateObj = new Date(examDate);
    const now = new Date();

    // Set time to 00:00:00 to compare dates strictly
    now.setHours(0, 0, 0, 0);
    const examDateCheck = new Date(examDateObj);
    examDateCheck.setHours(0, 0, 0, 0);

    if (examDateCheck < now) {
        return res.status(400).json({ msg: 'Exam date must be in the future' });
    }

    if (studyHoursPlanned <= 0) {
        return res.status(400).json({ msg: 'Study hours must be a positive number' });
    }

    try {
        const newRecord = new StudyRecord({
            studentId: req.student.id,
            subjectName,
            examDate,
            syllabusStatus: 'Not Started', // Default
            studyHoursPlanned,
            remainingHours: studyHoursPlanned,
            examStatus: 'Upcoming',
        });

        const record = await newRecord.save();
        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET /api/study/my-records
// @desc    Get all study records for logged in user
// @access  Private
exports.getMyRecords = async (req, res) => {
    try {
        let records = await StudyRecord.find({ studentId: req.student.id }).sort({
            examDate: 1,
        });

        // Auto-update status logic
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const updatedRecords = await Promise.all(records.map(async (record) => {
            const examDate = new Date(record.examDate);
            examDate.setHours(0, 0, 0, 0);
            let statusChanged = false;

            if (now >= examDate && record.examStatus !== 'Completed') {
                record.examStatus = 'Completed';
                record.syllabusStatus = 'Completed';
                statusChanged = true;
            }

            if (statusChanged) {
                await record.save();
            }
            return record;
        }));

        res.json(updatedRecords);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT /api/study/update/:id
// @desc    Update record (Timer, Status, Hours)
// @access  Private
exports.updateRecord = async (req, res) => {
    const { studyHoursCompleted, remainingHours, syllabusStatus, studyHoursPlanned } = req.body;

    try {
        let record = await StudyRecord.findById(req.params.id);

        if (!record) return res.status(404).json({ msg: 'Record not found' });

        // Make sure user owns record
        if (record.studentId.toString() !== req.student.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const fieldsToUpdate = {};
        if (studyHoursCompleted !== undefined) {
            fieldsToUpdate.studyHoursCompleted = studyHoursCompleted;
            // If getting updates for timer (studyHoursCompleted increases), set to In Progress if not done
            if (studyHoursCompleted > 0 && record.syllabusStatus === 'Not Started' && record.examStatus !== 'Completed') {
                fieldsToUpdate.syllabusStatus = 'In Progress';
            }
        }

        if (remainingHours !== undefined) {
            fieldsToUpdate.remainingHours = remainingHours;
            if (remainingHours <= 0) {
                fieldsToUpdate.syllabusStatus = 'Completed';
            }
        }

        if (syllabusStatus !== undefined) fieldsToUpdate.syllabusStatus = syllabusStatus;
        if (studyHoursPlanned !== undefined) fieldsToUpdate.studyHoursPlanned = studyHoursPlanned;


        record = await StudyRecord.findByIdAndUpdate(
            req.params.id,
            { $set: fieldsToUpdate },
            { new: true }
        );

        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   DELETE /api/study/delete/:id
// @desc    Delete a study record
// @access  Private
exports.deleteRecord = async (req, res) => {
    try {
        let record = await StudyRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ msg: 'Record not found' });

        if (record.studentId.toString() !== req.student.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await StudyRecord.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Exam Removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
