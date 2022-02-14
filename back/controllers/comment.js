const db = require("../models");
const Comment = db.comments;
const Op = db.Sequelize.Op;
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.createComment = (req, res) => {
    const comment = {
        userId: req.body.userId,
        topicId: req.body.topicId,
        postId: req.body.postId,
        content: req.body.content
    };
    Comment.create(comment)
        .then(data => { res.send(data); })
        .catch(error => res.status(400).json({ error }));
};

exports.getOneComment = (req, res) => {
    const id = req.params.id;
  
    Comment.findByPk(id)
        .then(comment => res.status(200).json(comment))
        .catch(error => res.status(404).json({ error }));

};

exports.getAllComments = (req, res) => {
    const content = req.query.content;
    const condition = content ? { content: { [Op.like]: `%${content}%` } } : null;
  
    Comment.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ error
        });
      });
  };

exports.modifyComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    Comment.findByPk(id)
        .then(comment => {
            if (comment.userId == userId) {
                Comment.update(req.body, { where: { id: id } } )
                    .then(() => res.status(200).json({ message: 'Utilisateur modifié!'}))
                    .catch(() => res.status(400).json({ error }));
            } else {
                res.status(401).json({ message: 'Opération non autorisée' })
            }
        })
        .catch(() => res.status(500).json({ error }));
};

exports.deleteComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    Comment.findByPk(id)
        .then(comment => {
            if (comment.userId == userId) {
                Comment.destroy( { where: { id: id } } )
                    .then(() => res.status(200).json({ message: 'Utilisateur modifié!'}))
                    .catch(() => res.status(400).json({ error }));
            } else {
                res.status(401).json({ message: 'Opération non autorisée' })
            }
        })
        .catch(() => res.status(500).json({ error }));
};

