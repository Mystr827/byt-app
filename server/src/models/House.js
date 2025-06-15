import mongoose from 'mongoose';

const SupplySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  expirationDate: Date,
  purchaseLink: String
});

const CleaningSchema = new mongoose.Schema({
  regularPeriodDays: Number,
  deepCleanPeriodDays: Number,
  customSchedule: Boolean,
  lastCleanedDate: Date
});

const MaintenanceTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['pending', 'in_progress', 'done'], default: 'pending' },
  dueDate: Date,
  attachments: [String]
});

const MaintenanceSchema = new mongoose.Schema({
  tasks: [MaintenanceTaskSchema]
});

const ElementSchema = new mongoose.Schema({
  name: String,
  type: String,
  modules: {
    supplies: [SupplySchema],
    cleaning: CleaningSchema,
    maintenance: MaintenanceSchema
  }
});

const RoomSchema = new mongoose.Schema({
  name: String,
  elements: [ElementSchema]
});

const HouseSchema = new mongoose.Schema({
  name: String,
  address: String,
  coordinates: {
    lat: Number,
    lon: Number
  },
  floors: Number,
  rooms: [RoomSchema],
  settings: {
    timezone: String,
    units: String,
    language: String
  }
});

export default mongoose.model('House', HouseSchema);
