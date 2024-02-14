const express = require('express');
const router = express.Router();
const firebaseController = require('../../controllers/chat.controller');

router.post('/', firebaseController.createData);
router.get('/:key', firebaseController.readData);
router.put('/:key', firebaseController.updateData);
router.delete('/:key', firebaseController.deleteData);

module.exports = router;
