// src/models/Package.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Sub‐schema for daily plans
const dailyPlanSchema = new Schema({
  day:        { type: Number, required: true },
  title:      { type: String, required: true },
  description:{ type: [String], default: [] },
  activities: { type: [String], default: [] },
  locations:  { type: [String], default: [] },
});

// Main package schema
const packageSchema = new Schema({
  name:             { type: String, required: true },
  theme:            { type: String, default: '' },
  description:      { type: String, default: '' },
  idealFor:         { type: [String], default: [] },           // e.g. ['Family','Honeymoon']
  startingPrice:    { type: String, required: true },         // e.g. '1500 USD'
  packageIcon:      { type: String, default: '' },            // URL
  packagePhotos:    { type: [String], default: [] },          // array of URLs
  dailyPlans:       { type: [dailyPlanSchema], default: [] },
  includedItems:    { type: [String], default: [] },
  notIncludedItems: { type: [String], default: [] },
}, {
  timestamps: true   // adds createdAt & updatedAt
});

export default model('Package', packageSchema);
