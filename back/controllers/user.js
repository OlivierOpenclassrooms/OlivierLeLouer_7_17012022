const db = require("../models");
const User = db.users;

const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = {
            email: req.body.email,
            password: hash,
            biographie: req.body.biographie,
            nom: req.body.nom,
            prenom: req.body.prenom,
            poste: req.body.poste,
        };
        User.create(user)
            .then(data => {
                res.send(data);
            })
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
    const email = req.body.email;

    User.findOne({  where: { email: email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            } 
            //S'il existe compare mot de passe entré et le hash de la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        //Encode un nouveau token
                        token: jwt.sign(
                            { userId: user.id },
                            //Utilisation d'une chaîne de caractère temporaire
                            'RANDOM_TOKEN_SECRET',
                            //Durée de validité et demande de reconnection au bout de 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneUser = (req, res) => {
    const id = req.params.id;
  
    User.findByPk(id)
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};

exports.modifyUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    User.findByPk(id)
        .then(user => {
            if (user.id == userId) {
                    bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = {
                            email: req.body.email,
                            password: hash,
                            biographie: req.body.biographie,
                            nom: req.body.nom,
                            prenom: req.body.prenom,
                            poste: req.body.poste,
                        };
                        if (req.file) {
                            user.imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                        }
                        User.update(user, { where: { id: id } } )
                            .then(() => res.status(200).json({ message: 'Utilisateur modifié!' }))
                            .catch((error) => res.status(400).json({ error } ));
                    })
                    .catch(error => res.status(500).json({ error }));
            } else {
                res.status(401).json({ message: 'Opération non autorisée' } )
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.deleteUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //Décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extrait l'id utilisateur et compare à celui extrait du token
    const userId = decodedToken.userId;

    const id = req.params.id;

    User.findByPk(id)
        .then(user => {
            if (user.id == userId) {
                User.destroy( { where: { id: id } } )
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé!'}))
                    .catch((error) => res.status(400).json({ error }));
            } else {
                res.status(401).json({ message: 'Opération non autorisée' })
            }
        })
        .catch((error) => res.status(500).json({ error }));
};