const db = require("../models");
const Topic = db.topics;
const Op = db.Sequelize.Op;
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.createTopic = (req, res) => {
    const topic = {
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
    };
    Topic.create(topic)
        .then(data => { res.send(data); })
        .catch(error => res.status(400).json({ error }));
};

exports.getOneTopic = (req, res) => {
    const id = req.params.id;
  
    Topic.findByPk(id)
        .then(topic => res.status(200).json(topic))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllTopics = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    Topic.findAll({ where: condition })
      .then(data => {res.send(data);
    })
      .catch(err => {
        res.status(500).send({ error
        });
      });
  };

exports.modifyTopic = (req, res) => {
    const id = req.params.id;

    Topic.findByPk(id)
        .then(() => {
            Topic.update(req.body, { where: { id: id } } )
                .then(() => res.status(200).json({ message: 'Topic modifié !'}))
                .catch(() => res.status(400).json({ error }));
        })
        .catch(() => res.status(500).json({ error }));
};

exports.deleteTopic = (req, res) => {
    const id = req.params.id;

    Topic.destroy( { where: { id: id } } )
        .then(() => res.status(200).json({ message: 'Topic supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};

