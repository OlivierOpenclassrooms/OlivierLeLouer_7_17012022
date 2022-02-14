const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { error } = require("console");

exports.createPost = (req, res) => {
    let image;
    let title = req.body.title;
    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } else {
        image == null
    };
    if (image == null || title == null) {
        res.status(400).json({ error: 'Rien à publier' })
    } else {
        const post = {
            userId: req.body.userId,
            title: title,
            imageUrl: image
        };
        Post.create(post)
            .then(data => { res.send(data); })
            .catch(error => res.status(400).json({ error }));
    }
};

exports.getOnePost = (req, res) => {
    const id = req.params.id;
  
    Post.findByPk(id)
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllPosts = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    Post.findAll({ where: condition })
      .then(data => {res.send(data);
    })
      .catch(error => {
        res.status(500).send({ error
        });
      });
  };

exports.modifyPost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    Post.findByPk(id)
        .then(post => {
            if (post.userId == userId) {
                Post.update(req.body, { where: { id: id } } )
                    .then(() => res.status(200).json({ message: 'Topic modifié!'}))
                    .catch(( error ) => res.status(400).json({ error }));
            } else {
                res.status(401).json({ message: 'Opération non autorisée' })
            }
        })
        .catch(() => res.status(500).json({ error }));
};

exports.deletePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    Post.findByPk(id)
        .then(post => {
            if (post.id == userId) {
                const filename = post.imageUrl.split('/images/')[1];
                    //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
                fs.unlink(`images/${filename}`, () => {
                Post.destroy( { where: { id: id } } )
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé!'}))
                    .catch((error) => res.status(400).json({ error }));
                    });
            } else {
                res.status(401).json({ message: 'Opération non autorisée' })
            }
        })
        .catch((error) => res.status(500).json({ error }));
};