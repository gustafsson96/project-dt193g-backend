const Joi = require('joi');

// Product routes for full CRUD functionality

module.exports = (pool) => [
    // Get all products
    {
        method: 'GET',
        path: '/products',
        handler: async (request, h) => {
            const { category_id } = request.query;

            try {
                let query = 'SELECT * FROM products';
                let params = [];

                if (category_id) {
                    query += ' WHERE category_id = $1';
                    params.push(category_id);
                }

                const res = await pool.query(query, params);
                return h.response(res.rows).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to fetch products' }).code(500);
            }
            // Require jwt
        },
        options: {
            auth: 'jwt'
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
                return h.response({ error: 'Failed to create product' }).code(500);
            }
        },
        // Require jwt and validate with Joi
        options: {
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(3).max(100).required(),
                    description: Joi.string().min(3).max(1000).required(),
                    price: Joi.number().required(),
                    category_id: Joi.number().integer().required(),
                    color: Joi.string().min(3).max(255).required(),
                    amount: Joi.number().integer().required()
                })
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
        },
        // Require jwt and validate with joi
        options: {
            auth: 'jwt',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    name: Joi.string().min(3).max(100).required(),
                    description: Joi.string().min(3).max(1000).required(),
                    price: Joi.number().required(),
                    category_id: Joi.number().integer().required(),
                    color: Joi.string().min(3).max(255).required(),
                    amount: Joi.number().integer().required()
                })
            }
        }
    },
    // Update amount for a product
    {
        method: 'PATCH',
        path: '/products/{id}/amount',
        handler: async (request, h) => {
            const { id } = request.params;
            const { amount } = request.payload;

            try {
                const result = await pool.query(
                    'UPDATE products SET amount = $1 WHERE id = $2 RETURNING *',
                    [amount, id]
                );

                if (result.rowCount === 0) {
                    return h.response({ error: 'Product not found' }).code(404);
                }

                return h.response(result.rows[0]).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to update amount' }).code(500);
            }
        },
        options: {
            auth: 'jwt',
            validate: {
                params: Joi.object({ id: Joi.number().integer().required() }),
                payload: Joi.object({ amount: Joi.number().integer().required() })
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
        },
        // Require jwt and validate with Joi
        options: {
            auth: 'jwt',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        }
    }
];