const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

/**
 * Kullanıcı kimliğini doğrulayan middleware
 */
const protect = async (req, res, next) => {
  let token;

  // Token'ı header'dan al
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Bearer token'ını ayır
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, config.jwtSecret);

      // Kullanıcıyı bul ve şifreyi hariç tut
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error.message);
      res.status(401).json({
        success: false,
        message: 'Oturum geçersiz, lütfen tekrar giriş yapın'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Yetkilendirme token\'ı bulunamadı'
    });
  }
};

module.exports = { protect }; 