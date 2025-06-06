const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// Rotaları içe aktar
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Express uygulaması oluştur
const app = express();

// Middleware'leri ayarla
app.use(cors({
  origin: '*', // Tüm kaynaklardan gelen isteklere izin ver
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB'ye bağlan
mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı!');
  })
  .catch((error) => {
    console.error('MongoDB bağlantı hatası:', error.message);
  });

// API rotalarını ayarla
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

// Ana yol için bilgi mesajı
app.get('/', (req, res) => {
  res.send('Seyahat Planlayıcı API çalışıyor!');
});

// 404 hatası için
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'İstenen sayfa bulunamadı'
  });
});

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Sunucuyu başlat
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); 