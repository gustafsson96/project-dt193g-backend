
// Category routes for full CRUD functionality

module.exports = (pool) => [
    // Get all category
    {
        method: 'GET',
        path: '/categories',
        handler: async (request, h) => {
            try {
                const res = await pool.query('SELECT * FROM categories');
                return h.response(res.rows).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: err.message }).code(500);
            }
        }
    },
    // Add new category
    {
        method: 'POST',
        path: '/categories',
        handler: async (request, h) => {
            const { name, description } = request.payload;

            try {
                const result = await pool.query(
                    `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
                    [name, description]
                );

                return h.response(result.rows[0]).code(201);
            } catch (err) {
                console.error(err);
                return h.response({ error: err.message }).code(500);
            }
        }
    },
    // Update a category
    {
        method: 'PUT',
        path: '/categories/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { name, description } = request.payload;

            try {
                const result = await pool.query(
                    `UPDATE categories
                 SET name = $1,
                     description = $2
                 WHERE id = $3
                 RETURNING *`,
                    [name, description, id]
                );

                if (result.rowCount === 0) {
                    return h.response({ error: 'Category not found' }).code(404);
                }

                return h.response(result.rows[0]).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to update category' }).code(500);
            }
        }
    },
    // Delete a category
    {
        method: 'DELETE',
        path: '/categories/{id}',
        handler: async (request, h) => {
            const { id } = request.params;

            try {
                const result = await pool.query(
                    `DELETE FROM categories WHERE id = $1 RETURNING *`,
                    [id]
                );

                if (result.rowCount === 0) {
                    return h.response({ error: 'category not found' }).code(404);
                }

                return h.response(result.rows[0]).code(200);

            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to delete category' }).code(500);
            }
        }
    }
];