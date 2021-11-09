
const authorize = require('../../middleware/authorize');
const {
    storeSchema,
    store,
    getAll,
    getById,
    updateSchema,
    update,
    _delete
} = require('../book/book.controller');
const router = require('express').Router();

router.get('/get', authorize(), getAll);
router.get('/get/:id', authorize(), getById);
router.post('/store', authorize(), storeSchema, store);
router.put('/update/:id', authorize(), updateSchema, update);
router.delete('/delete/:id', authorize(), _delete)

module.exports = router;