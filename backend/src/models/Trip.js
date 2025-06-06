const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Başlık gereklidir'],
    trim: true,
    default: 'İsimsiz Seyahat'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: function() {
      // Varsayılan olarak başlangıç tarihinden 7 gün sonra
      const date = new Date(this.startDate || Date.now());
      date.setDate(date.getDate() + 7);
      return date;
    },
    validate: {
      validator: function(value) {
        // Eğer bitiş tarihi belirtilmişse, başlangıç tarihinden sonra olmalı
        const startDate = this.startDate || new Date();
        return !value || value >= startDate;
      },
      message: 'Bitiş tarihi başlangıç tarihinden önce olamaz'
    }
  },
  destinations: [{
    name: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  budget: {
    type: mongoose.Schema.Types.Mixed,
    default: 'Belirtilmemiş'
  },
  notes: {
    type: String,
    default: ''
  },
  activities: [{
    title: String,
    description: String,
    date: Date,
    location: String,
    cost: Number
  }],
  accommodations: [{
    name: String,
    address: String,
    checkIn: Date,
    checkOut: Date,
    cost: Number,
    reservationInfo: String
  }],
  transportations: [{
    type: String,
    from: String,
    to: String,
    departureDate: Date,
    arrivalDate: Date,
    cost: Number,
    reservationInfo: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip; 