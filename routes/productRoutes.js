
// Product routes for full CRUD functionality

module.exports = (pool) => [
    // Get all products
    {
        method: 'GET',
        path: '/products',
        handler: async (request, h) => {
            try {
                const res = await pool.query('SELECT * FROM products');
                return h.response(res.rows).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: err.message }).code(500);
            }
        }
    },
    // Add new product
    {
        method: 'POST',
        path: '/products',
        handler: async (request, h) => {
            const { name, description, price, category_id, color, amount } = request.payload;

            try {
                const result = await pool.query(
                    `INSERT INTO products (name, description, price, category_id, color, amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                    [name, description, price, category_id, color, amount]
                );

                return h.response(result.rows[0]).code(201);
            } catch (err) {
                console.error(err);
                return h.response({ error: err.message }).code(500);
            }
        }
    },
    // Update a product
    {
        method: 'PUT',
        path: '/products/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { name, description, price, category_id, color, amount } = request.payload;

            try {
                const result = await pool.query(
                    `UPDATE products
                 SET name = $1,
                     description = $2,
                     price = $3,
                     category_id = $4,
                     color = $5,
                     amount = $6
                 WHERE id = $7
                 RETURNING *`,
                    [name, description, price, category_id, color, amount, id]
                );

                if (result.rowCount === 0) {
                    return h.response({ error: 'Product not found' }).code(404);
                }

                return h.response(result.rows[0]).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to update product' }).code(500);
            }
        }
    },
    // Delete a product
    {
        method: 'DELETE',
        path: '/products/{id}',
        handler: async (request, h) => {
            const { id } = request.params;

            try {
                const result = await pool.query(
                    `DELETE FROM products WHERE id = $1 RETURNING *`,
                    [id]
                );

                if (result.rowCount === 0) {
                    return h.response({ error: 'Product not found' }).code(404);
                }

                return h.response(result.rows[0]).code(200);

            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to delete product' }).code(500);
            }
        }
    }
];