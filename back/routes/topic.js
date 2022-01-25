const express = require('express');

const router = express.Router();

const topicCtrl = require('../controllers/topic');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.get('/', topicCtrl.getAllTopics);
router.get('/:id', topicCtrl.getOneTopic);
router.post('/', multer, topicCtrl.createTopic);
router.delete('/:id', topicCtrl.deleteTopic);
router.put('/:id', multer, topicCtrl.modifyTopic);

module.exports= router;