const mongoose = require('mongoose');
const User = require('../src/models/User');
const config = require('../src/config');

// Command line arguments
const args = process.argv.slice(2);
const email = args[0] || 'test@example.com';
const password = args[1] || 'password123';
const displayName = args[2] || email.split('@')[0];

// MongoDB'ye bağlan
mongoose.connect(config.mongoURI)
  .then(async () => {
    console.log('MongoDB bağlantısı başarılı!');
    
    try {
      // Önce kullanıcının zaten var olup olmadığını kontrol et
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        console.log(`❌ ${email} e-posta adresi zaten kayıtlı.`);
        process.exit(1);
      }
      
      // Yeni kullanıcı oluştur
      const newUser = new User({
        email,
        password,
        displayName
      });
      
      // Kullanıcıyı kaydet
      await newUser.save();
      
      console.log('✅ Kullanıcı başarıyla oluşturuldu:');
      console.log(`E-posta: ${email}`);
      console.log(`Şifre: ${password}`);
      console.log(`Görünen Ad: ${displayName}`);
      console.log('ID:', newUser._id.toString());
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Kullanıcı oluşturma hatası:', error.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  }); 