const mongoose = require('mongoose');
const router = require('express').Router();

const {
    createReport,
    getReports,
    getReportById,
    deleteReportWithId,
    getAllReports,
    compareReports
  } = require('../Controller/reportController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/create', verifyToken, createReport);
router.get('/', verifyToken, getReports);
router.get('/:id', verifyToken, getReportById);
router.delete('/:id', verifyToken, deleteReportWithId);
router.get('/all', verifyToken, getAllReports);
router.get('/compare', verifyToken, compareReports);

module.exports = router;
// Compare this snippet from Travel_Budget/backend/Routes/reportRoutes.js: