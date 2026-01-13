'use strict';
const createTables = require('../install');

module.exports = () => {
  return [
    {
      method: 'GET',
      path: '/install',
      handler: async (req, h) => {
        try {
          await createTables();
          return { status: 'Tables created' };
        } catch (err) {
          return h.response({ status: 'Error', error: err.message }).code(500);
        }
      }
    }
  ];
};