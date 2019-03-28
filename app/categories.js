const express = require('express');

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT `id`, `name` FROM `categories`', (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            res.send(results);
        })
    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `categories` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            if (results[0]) {
                res.send(results[0]);
            } else {
                res.status(404).send({error: 'Category not found'});
            }
        });
    });

    router.post('/', (req, res) => {
        const newCategory = req.body;

        connection.query('INSERT INTO `categories` (`name`, `description`) VALUES (?, ?)',
            [newCategory.name, newCategory.description],
            (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            res.send({...newCategory, id: results.insertId});
        });
    });

    router.delete('/:id', (req, res) => {
        connection.query('DELETE FROM `categories` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            res.send({message: 'Category deleted!'});
        });
    });

    router.put('/:id', (req, res) => {
        const updatedCategory = req.body;
        updatedCategory.id = req.params.id;

        connection.query('UPDATE `categories` SET name = ?, description = ? WHERE id = ?',
            [updatedCategory.name, updatedCategory.description, updatedCategory.id],
            (error, results) => {
                if (error) {
                    return res.status(500).send({error: error.sqlMessage});
                }

                connection.query('SELECT * FROM `categories` WHERE id = ?', updatedCategory.id, (error, results) => {
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
