import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import User from '../models/User.js';

dotenv.config();

const demoAgent = {
  fullName: 'PropSpace Listings Team',
  email: 'listings@propspace.local',
  password: 'PropSpaceDemo123!',
  role: 'admin',
  phone: '+237 600 000 000',
};

const sampleProperties = [
  {
    title: 'Modern Family Villa in Bonapriso',
    description:
      'A well-finished family villa with bright living areas, a fitted kitchen, secure parking, and a private outdoor terrace. Located close to schools, restaurants, and major access roads.',
    price: 185000000,
    location: 'Bonapriso, Douala',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Executive Apartment Near Bastos',
    description:
      'A polished apartment designed for convenient city living, with an open-plan lounge, modern kitchen finishes, ensuite bedrooms, backup power, and controlled access.',
    price: 95000000,
    location: 'Bastos, Yaounde',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 185,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Contemporary Duplex in Makepe',
    description:
      'A spacious duplex with clean architectural lines, generous bedrooms, a landscaped compound, and dedicated service areas. Suitable for a family residence or corporate lease.',
    price: 145000000,
    location: 'Makepe, Douala',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 4,
    area: 360,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Prime Commercial Space in Akwa',
    description:
      'A visible commercial unit in a busy business district, offering flexible floor space, frontage for signage, reliable utilities, and easy access for customers and staff.',
    price: 125000000,
    location: 'Akwa, Douala',
    propertyType: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 240,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Serviced Apartment in Golf',
    description:
      'A comfortable serviced apartment with tasteful interiors, balcony views, fitted wardrobes, secure access, and parking. Ideal for professionals seeking a quiet address.',
    price: 78000000,
    location: 'Golf, Yaounde',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 125,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Residential Land in Kribi',
    description:
      'A titled residential plot in a growing area with road access and nearby utilities. Suitable for a private residence, rental development, or long-term investment.',
    price: 42000000,
    location: 'Kribi',
    propertyType: 'land',
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const seedSampleProperties = async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI === 'your_mongodb_connection_string') {
    throw new Error('Set MONGO_URI in server/.env before running the seed command.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const password = await bcrypt.hash(demoAgent.password, 10);
  const owner = await User.findOneAndUpdate(
    { email: demoAgent.email },
    { ...demoAgent, password },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await Property.deleteMany({ owner: owner._id });

  const properties = sampleProperties.map((property) => ({
    ...property,
    owner: owner._id,
  }));

  await Property.insertMany(properties);
  await mongoose.disconnect();

  console.log(`Imported ${properties.length} sample properties.`);
};

seedSampleProperties().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
