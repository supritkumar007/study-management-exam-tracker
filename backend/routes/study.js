const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const studyController = require('../controllers/studyController');

router.post('/add', auth, studyController.addRecord);
router.get('/my-records', auth, studyController.getMyRecords);
router.put('/update/:id', auth, studyController.updateRecord);
router.delete('/delete/:id', auth, studyController.deleteRecord);

module.exports = router;
