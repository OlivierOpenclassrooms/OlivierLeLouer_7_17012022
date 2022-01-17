const express = require('express');

const router = express.Router();

const commentCtrl = require('../controllers/comment');

router.post('/', commentCtrl.createComment);
router.delete('/:id', commentCtrl.deleteComment);
router.put('/:id', commentCtrl.modifyComment);
router.get('/', commentCtrl.getAllComment);
router.get('/:id', commentCtrl.getOneComment);

module.exports = router;