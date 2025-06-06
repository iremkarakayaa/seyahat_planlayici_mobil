const Trip = require('../models/Trip');
const User = require('../models/User');

/**
 * @desc    Yeni seyahat planı oluştur
 * @route   POST /api/trips
 * @access  Private
 */
const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, destinations, budget, notes } = req.body;

    console.log('Alınan seyahat verileri:', JSON.stringify({
      title, 
      startDate, 
      endDate, 
      budget
    }));

    // Varsayılan tarihler oluştur
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    // Seyahat verilerini hazırla (tarihleri ve bütçeyi doğru formata dönüştür)
    const tripData = {
      userId: req.user._id,
      title: title || 'İsimsiz Seyahat',
      description: description || '',
      startDate: startDate ? new Date(startDate) : today,
      endDate: endDate ? new Date(endDate) : oneWeekLater,
      destinations: destinations || [],
      budget: budget || 'Belirtilmemiş',
      notes: notes || ''
    };

    console.log('İşlenmiş seyahat verileri:', JSON.stringify({
      title: tripData.title, 
      startDate: tripData.startDate, 
      endDate: tripData.endDate, 
      budget: tripData.budget
    }));

    // Yeni seyahat planı oluştur
    const trip = await Trip.create(tripData);

    if (trip) {
      // Kullanıcı modelini güncelle ve seyahat planını ekle
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { trips: trip._id } },
        { new: true }
      );

      res.status(201).json({
        success: true,
        trip
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Geçersiz seyahat planı verileri'
      });
    }
  } catch (error) {
    console.error('Seyahat planı oluşturma hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

/**
 * @desc    Kullanıcıya ait seyahat planlarını getir
 * @route   GET /api/trips
 * @access  Private
 */
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips
    });
  } catch (error) {
    console.error('Seyahat planlarını getirme hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

/**
 * @desc    Belirli bir seyahat planını getir
 * @route   GET /api/trips/:id
 * @access  Private
 */
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Seyahat planı bulunamadı'
      });
    }

    // Sadece kullanıcının kendi seyahat planlarına erişimi olsun
    if (trip.userId.toString() !== req.user._id.toString() && !trip.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Bu seyahat planına erişim izniniz yok'
      });
    }

    res.status(200).json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('Seyahat planı getirme hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

/**
 * @desc    Seyahat planını güncelle
 * @route   PUT /api/trips/:id
 * @access  Private
 */
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Seyahat planı bulunamadı'
      });
    }

    // Sadece kullanıcının kendi seyahat planlarını güncelleyebilmesi
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bu seyahat planını güncelleme izniniz yok'
      });
    }

    // Güncelleme
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Seyahat planı güncelleme hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

/**
 * @desc    Seyahat planını sil
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Seyahat planı bulunamadı'
      });
    }

    // Sadece kullanıcının kendi seyahat planlarını silebilmesi
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bu seyahat planını silme izniniz yok'
      });
    }

    // Seyahat planını sil
    await Trip.findByIdAndDelete(req.params.id);

    // Kullanıcı modelinden seyahat planı referansını kaldır
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { trips: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Seyahat planı başarıyla silindi'
    });
  } catch (error) {
    console.error('Seyahat planı silme hatası:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
}; 