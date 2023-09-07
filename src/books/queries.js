const getBooks = `
        SELECT id, title, author, img_url, price, count FROM books OFFSET $1 LIMIT $2
`
const getBook = `
            SELECT JSON_BUILD_OBJECT(
                'id', b1.id,
                'title', b1.title,
                'author', b1.author,
                'img_url', b1.img_url,
                'description', b1.description,
                'price', b1.price,
                'language', b1.language,
                'count', b1.count,
                'category', (SELECT name FROM categories cat WHERE b1.category_id = cat.id)
            ) as book,
            ARRAY(
            SELECT JSON_BUILD_OBJECT(
                'id', b2.id,
                'title', b2.title,
                'author', b2.author,
                'img_url', b2.img_url,
                'description', b2.description,
                'price', b2.price,
                'language', b2.language,
                'count', b2.count,
                'category', (select name from categories cat where b2.category_id = cat.id)
                )
                FROM books b2
                WHERE b2.category_id = b1.category_id AND b1.id != b2.id
            ) as others
            FROM books b1
            WHERE b1.id = $1
`
const getBooksByCategory = 'SELECT * FROM books where category_id = $1'
const getUser = `
                SELECT
                json_build_object(
                    'id', u.id,
                    'name', u.name, 
                    'email', u.email,
                    'books', array(select row_to_json(books) from books where u.id = books.owner_id)
                ) as user FROM users u
`
const getCategories = 'SELECT * FROM categories'

module.exports = {
    getBooks,
    getBook,
    getBooksByCategory, 
    getCategories
}
