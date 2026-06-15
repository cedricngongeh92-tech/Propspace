import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'land', 'commercial'],
  },
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },
  area: {
    type: Number,
  },
  images: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: 'available',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
