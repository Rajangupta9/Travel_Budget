const express = require('express');
const router = express.Router();
const {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpenseWithId,
    deleteExpenseWithId,
    getExpenseStatistics} = require('../Controller/expenseController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/create', verifyToken, createExpense);
router.get('/', verifyToken, getExpenses);  
router.get('/:id', verifyToken, getExpenseById);
router.put('/:id', verifyToken, updateExpenseWithId);
router.delete('/:id', verifyToken, deleteExpenseWithId);
router.get('/statistics/:tripId', verifyToken, getExpenseStatistics);

module.exports = router;