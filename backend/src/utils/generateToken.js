const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Kullanıcı için JWT token oluşturur
 * @param {string} id - Kullanıcı ID'si
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

module.exports = generateToken; 