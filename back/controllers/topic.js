const db = require("../models");
const Topic = db.topics;
const User = db.users;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const { error } = require("console");

exports.createTopic = (req, res) => {
    const topic = {
        title: req.body.title,
        userId: req.body.userId
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
      .catch(error => {
        res.status(500).send({ error
        });
      });
  };

exports.modifyTopic = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;

    User.findByPk(userIdOrder)
        .then(user => {
            if(user.isAdmin == true && user.id == userId) {
                Topic.update(req.body, { where: { id: id } } )
                    .then(() => res.status(200).json({ message: 'Topic modifié en tant qu\'administrateur !'}))
                    .catch(( error ) => res.status(400).json({ error }));
            } else { 
                Topic.findByPk(id)
                    .then(topic => {
                        if (topic.userId == userId) {
                            Topic.update(req.body, { where: { id: id } } )
                                .then(() => res.status(200).json({ message: 'Topic modifié !'}))
                                .catch(( error ) => res.status(400).json({ error }));
                        } else {
                            res.status(401).json({ message: 'Opération non autorisée' })
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteTopic = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    const userIdOrder = req.body.userIdOrder;

    User.findByPk(userIdOrder)
    .then(user => {
        if(user.isAdmin == true && user.id == userId) {
            Topic.destroy( { where: { id: id } } )
                .then(() => res.status(200).json({ message: 'Topic supprimé!'}))
                .catch(( error ) => res.status(400).json({ error }));
        } else { 
            Topic.findByPk(id)
                .then(topic => {
                    if (topic.userId == userId) {
                        Topic.destroy( { where: { id: id } } )
                            .then(() => res.status(200).json({ message: 'Topic supprimé!'}))
                            .catch(( error ) => res.status(400).json({ error }));
                    } else {
                        res.status(401).json({ message: 'Opération non autorisée' })
                    }
                })
                .catch((error) => res.status(500).json({ error }));
        }
    })
    .catch((error) => res.status(500).json({ error }));
};

