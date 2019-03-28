const express = require('express');

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT `id`, `name` FROM `places`', (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            res.send(results);
        })
    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `places` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            if (results[0]) {
                res.send(results[0]);
            } else {
                res.status(404).send({error: 'Place not found'});
            }
        });
    });

    router.post('/', (req, res) => {
        const newPlace = req.body;

        connection.query('INSERT INTO `places` (`name`, `description`) VALUES (?, ?)',
            [newPlace.name, newPlace.description],
            (error, results) => {
                if (error) {
                    return res.status(500).send({error: error.sqlMessage});
                }

                res.send({...newPlace, id: results.insertId});
            });
    });

    router.delete('/:id', (req, res) => {
        connection.query('DELETE FROM `places` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            res.send({message: 'Place deleted!'});
        });
    });

    router.put('/:id', (req, res) => {
        const updatedPlace = req.body;
        updatedPlace.id = req.params.id;

        connection.query('UPDATE `places` SET name = ?, description = ? WHERE id = ?',
            [updatedPlace.name, updatedPlace.description, updatedPlace.id],
            (error, results) => {
                if (error) {
                    return res.status(500).send({error: error.sqlMessage});
                }

                connection.query('SELECT * FROM `places` WHERE id = ?', updatedPlace.id, (error, results) => {
                    if (error) {
                        return res.send({error: error.sqlMessage})
                    }

                    res.send(results);
                });
            });
    });

    return router;
};



module.exports = createRouter;
