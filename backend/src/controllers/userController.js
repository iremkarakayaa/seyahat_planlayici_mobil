const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Kullanıcı kaydı
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      email,
      password,
      displayName: displayName || email.split('@')[0]
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı bilgileri'
      });
    }
  } catch (error) {
    console.error('Kayıt hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

/**
 * @desc    Kullanıcı girişi
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı e-posta ile bul
    const user = await User.findOne({ email });

    // Kullanıcı varsa ve şifre doğruysa
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }
  } catch (error) {
    console.error('Giriş hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

/**
 * @desc    Kullanıcı profilini getir
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          profilePicture: user.profilePicture,
          trips: user.trips
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
  } catch (error) {
    console.error('Profil getirme hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

/**
 * @desc    Kullanıcı profilini güncelle
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.displayName = req.body.displayName || user.displayName;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      
      // Şifre değiştiriliyorsa
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        user: {
          _id: updatedUser._id,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          profilePicture: updatedUser.profilePicture,
          token: generateToken(updatedUser._id)
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
  } catch (error) {
    console.error('Profil güncelleme hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
}; 