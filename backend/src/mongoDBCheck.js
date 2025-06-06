const mongoose = require('mongoose');
const config = require('./config');

// MongoDB'ye bağlan
mongoose
  .connect(config.mongoURI)
  .then(async () => {
    console.log('MongoDB bağlantısı başarılı!');
    
    try {
      // Tüm koleksiyonları listele
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      console.log('Veritabanındaki koleksiyonlar:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
      // users koleksiyonunu kontrol et
      if (collections.some(c => c.name === 'users')) {
        // users koleksiyonundaki verileri getir
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('\nUsers koleksiyonundaki kayıtlar:');
        console.log(JSON.stringify(users, null, 2));
        console.log(`Toplam ${users.length} kullanıcı bulundu.`);
      }
      
      // User koleksiyonunu kontrol et (büyük harfle)
      if (collections.some(c => c.name === 'User')) {
        // User koleksiyonundaki verileri getir
        const users = await mongoose.connection.db.collection('User').find({}).toArray();
        console.log('\nUser koleksiyonundaki kayıtlar:');
        console.log(JSON.stringify(users, null, 2));
        console.log(`Toplam ${users.length} kullanıcı bulundu.`);
      }
      
      // kullanıcı verisini içeren herhangi bir koleksiyon ara
      for (const collection of collections) {
        if (collection.name !== 'users' && collection.name !== 'User') {
          const sampleData = await mongoose.connection.db.collection(collection.name).findOne({email: {$exists: true}});
          if (sampleData) {
            console.log(`\nKullanıcı verisi ${collection.name} koleksiyonunda bulundu:`);
            const allData = await mongoose.connection.db.collection(collection.name).find({}).toArray();
            console.log(JSON.stringify(allData, null, 2));
          }
        }
      }
      
    } catch (error) {
      console.error('Verileri getirme hatası:', error);
    } finally {
      // Bağlantıyı kapat
      await mongoose.connection.close();
      console.log('\nMongoDB bağlantısı kapatıldı.');
    }
  })
  .catch((error) => {
    console.error('MongoDB bağlantı hatası:', error.message);
  }); 