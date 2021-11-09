
const {Book} = require('../../models/');
const { Op } = require('sequelize');
const {getPagination, getPagingData} = require('../../helper/paging');

module.exports = {
    store,
    getAll,
    getById,
    update,
    delete: _delete
}

async function getAll(req)
{
    const { page, size, title, genre, author } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = {};

    if (title) {
        condition['title'] = { [Op.like]: `%${title}%` };
    }

    if (genre) {
        condition['genre'] = { [Op.like]: `%${genre}%` };
    }

    if (author) {
        condition['author'] = { [Op.like]: `%${author}%` };
    }

    var bookData = await Book.findAndCountAll({ where: condition, limit, offset });
    bookData.rows = bookData.rows.map(x => responseDetails(x));
    const response = getPagingData(bookData, page, limit);
    return {
        status: true,
        message: "Data successfully taken",
        response
    };
}

async function getById(id) {
    const book = await getBook(id);
    return {
        status: true,
        message: "Data successfully taken",
        ...responseDetails(book),
    }
}

async function store(params, origin)
{
    try {
        if (await Book.findOne({ where: { title: params.title } })) {
            throw new Error(`Book Titled ${params.title} does exist. Please input another title`);
        }
    } catch (error) {
        throw new Error(error);
    }
    

    const book = new Book(params);

    await book.save();

    return responseDetails(book);
}

async function update(id, params)
{
    const book = await getBook(id);
    Object.assign(book, params);
    book.updated = Date.now();
    await book.save();

    return responseDetails(book);
}

async function _delete(id)
{
    const book = await getBook(id);

    await book.destroy();
}

async function getBook(id) {
    const book = await Book.findByPk(id);
    if (!book) throw 'buku tidak ditemukan';
    return book;
}

function responseDetails(param) {
    const { id, title, genre, author, createdAt } = param;
    return { id, title, genre, author, createdAt };
}
