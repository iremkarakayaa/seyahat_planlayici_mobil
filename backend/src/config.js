// Basit yapılandırma dosyası
// .env dosyasını yüklemek yerine doğrudan değerler tanımlanıyor
module.exports = {
  // MongoDB URI
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/seyahatapp',
  
  // JWT için gizli anahtar
  jwtSecret: process.env.JWT_SECRET || 'seyahat_planlayici_jwt_gizli_anahtar',
  
  // JWT token süresi (saniye cinsinden)
  jwtExpire: '7d',
  
  // Sunucu portu
  port: process.env.PORT || 5000
}; 