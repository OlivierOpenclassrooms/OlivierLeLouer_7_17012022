const express = require('express');

const router = express.Router();

const topicCtrl = require('../controllers/topic');

router.get('/', topicCtrl.getAllTopics);
router.get('/:id', topicCtrl.getOneTopic);
router.post('/', topicCtrl.createTopic);
router.delete('/:id', topicCtrl.deleteTopic);
router.put('/:id', topicCtrl.modifyTopic);


module.exports= router;