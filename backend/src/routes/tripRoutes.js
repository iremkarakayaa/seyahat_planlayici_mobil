const express = require('express');
const router = express.Router();
const { 
  createTrip, 
  getTrips, 
  getTripById,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Tüm rotalar korumalı
router.use(protect);

// Tüm seyahat planlarını getir ve yeni seyahat planı oluştur
router.route('/')
  .get(getTrips)
  .post(createTrip);

// Belirli bir seyahat planı ile ilgili işlemler
router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router; 