
const Joi = require('joi');
const validateRequest = require('../../middleware/validate-request');
const bookService = require('../../modules/book/book.service');

module.exports = {
    getAll,
    getById,
    storeSchema,
    store,
    updateSchema,
    update,
    _delete
}

function getAll(req, res, next)
{
    bookService.getAll(req)
        .then(book => res.json(book))
        .catch(next);
}

function getById(req, res, next)
{
    bookService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function storeSchema(req, res, next)
{
    const schema = Joi.object({
        title: Joi.string().required(),
        genre: Joi.string().required(),
        author: Joi.string().required()
    });

    validateRequest(res, req, next, schema, 'Storing Book');
}

function store(req, res, next)
{
    bookService.store(req.body)
        .then(book => res.json(book))
        .catch(next);
}

function updateSchema(req, res, next)
{
    const schema = Joi.object({
        title: Joi.string().required(),
        genre: Joi.string().required(),
        author: Joi.string().required()
    });

    validateRequest(res, req, next, schema, 'Update Book');
}

function update(req, res, next)
{
    bookService.update(req.params.id, req.body)
        .then(book => res.json(book))
        .catch(next);
}

function _delete(req, res, next)
{
    bookService.delete(req.params.id)
        .then(() => res.json({ message: "Book Deleted Successfully" }))
        .catch(next);
}
