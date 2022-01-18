const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

const bcrypt = require('bcrypt');

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

exports.login = (req,res) => {
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

exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.destroy( { where: { id: id } } )
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.updateUser = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(() => {
            User.update(req.body, { where: { id: id } } )
                .then(() => res.status(200).json({ message: 'Utilisateur modifié!'}))
                .catch(() => res.status(400).json({ error }));
        })
        .catch(() => res.status(500).json({ error }));
};