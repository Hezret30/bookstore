const getUser = "SELECT id, username, email, phone, city FROM users WHERE id = $1"

const getUserBooks = `
                SELECT
                JSON_BUILD_OBJECT(
                    'id', u.id,
                    'username', u.username, 
                    'books', ARRAY(SELECT JSON_BUILD_OBJECT(
                        'id', ub.id,
                        'title', ub.title,
                        'author', ub.author,
                        'img_url', ub.img_url,
                        'price', ub.price,
                        'category', (SELECT name FROM categories cat WHERE ub.category_id = cat.id),
                        'user_id', ub.user_id
                    ) FROM users_books ub WHERE u.id = ub.user_id)
                )as user FROM users u where id = $1
`

const getUserBook = `
                SELECT 
                JSON_BUILD_OBJECT(
                    'id', ub.id,
                    'title', ub.title,
                    'author', ub.author,
                    'img_url', ub.img_url,
                    'description', ub.description,
                    'price', ub.price,
                    'language', ub.language,
                    'category', (SELECT name FROM categories cat WHERE ub.category_id = cat.id)
                ) as book FROM users_books ub WHERE id = $1 AND user_id = $2
`

const updateUser = `UPDATE users SET username = $1, phone = $2, email = $3, city = $4 WHERE id = $5`
const changePassword = `UPDATE users SET password = $1 WHERE id = $2`
const deleteUser = `DELETE FROM users WHERE id = $1`

const addBook = `INSERT INTO users_books (title, author, img_url, description, language, category_id, price, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
const updateBookNoImage = 'UPDATE users_books SET title = $1, author = $2, description = $3, language = $4, category_id = $5, price = $6 WHERE id = $7 AND user_id = $8'
const updateBookWithImage = 'UPDATE users_books SET title = $1, author = $2, img_url = $3, description = $4, language = $5, category_id = $6, price = $7 WHERE id = $8 AND user_id = $9'
const deleteBook = "DELETE FROM users_books WHERE id = $1 AND user_id = $2"

module.exports = {
    getUser,
    getUserBooks,
    getUserBook,
    updateUser,
    deleteUser,
    changePassword,
    addBook,
    updateBookNoImage,
    updateBookWithImage,
    deleteBook
}