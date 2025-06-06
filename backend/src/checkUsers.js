const mongoose = require('mongoose');
const config = require('./config');

// MongoDB'ye bağlan
mongoose
  .connect(config.mongoURI)
  .then(async () => {
    console.log('MongoDB bağlantısı başarılı!');
    
    // Kullanıcı şemasını doğrudan buraya tanımlayalım (modeli tekrar yüklemeden)
    // Bu şemanın backend/src/models/userModel.js ile aynı olduğundan emin olun
    const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      displayName: {
        type: String,
        default: ''
      }
    }, {
      timestamps: true
    });
    
    // Model oluştur
    const User = mongoose.model('User', userSchema);
    
    try {
      // Tüm kullanıcıları getir
      const users = await User.find({}).select('-password');
      
      console.log('Kayıtlı kullanıcılar:');
      console.log(JSON.stringify(users, null, 2));
      console.log(`Toplam ${users.length} kullanıcı bulundu.`);
    } catch (error) {
      console.error('Kullanıcıları getirme hatası:', error);
    } finally {
      // Bağlantıyı kapat
      await mongoose.connection.close();
      console.log('MongoDB bağlantısı kapatıldı.');
    }
  })
  .catch((error) => {
    console.error('MongoDB bağlantı hatası:', error.message);
  }); 