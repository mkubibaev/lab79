const express = require('express');
const path = require('path');
const multer = require('multer');
const nanoid = require('nanoid');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});


const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT `id`, `category_id`, `place_id`, `name` FROM `items`', (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            res.send(results);
        })
    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `items` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            if (results[0]) {
                res.send(results[0]);
            } else {
                res.status(404).send({error: 'Item not found'});
            }
        });
    });

    router.post('/', upload.single('image'), (req, res) => {
        const newItem = req.body;

        if (req.file) {
            newItem.image = req.file.filename;
        }

        connection.query('INSERT INTO `items` (`category_id`, `place_id`, `name`, `description`, `image`) VALUES (?,?,?,?,?)',
            [
                newItem.category,
                newItem.place,
                newItem.name,
                newItem.description,
                newItem.image,
            ],
            (error, results) => {
                if (error) {
                    return res.status(500).send({error: error.sqlMessage});
                }

                res.send({...newItem, id: results.insertId});
            });
    });

    router.delete('/:id', (req, res) => {
        connection.query('DELETE FROM `items` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                return res.status(500).send({error: error.sqlMessage});
            }

            res.send({message: 'Item deleted!'});
        });
    });

    router.put('/:id', upload.single('image'), (req, res) => {
        const updatedItem = req.body;
        updatedItem.id = req.params.id;

        if (req.file) {
            updatedItem.image = req.file.filename;
        }

        connection.query(`UPDATE items SET category_id = ?, place_id = ?, name = ?, description = ?, image = ? WHERE id = ?`,
            [
                updatedItem.category,
                updatedItem.place,
                updatedItem.name,
                updatedItem.description,
                updatedItem.image,
                updatedItem.id
            ],
            (error, results) => {
                if (error) {
                    return res.status(500).send({error: error.sqlMessage});
                }

                connection.query('SELECT * FROM `items` WHERE id = ?', updatedItem.id, (error, results) => {
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
