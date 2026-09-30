const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    age: { type: Number, min: 1, max: 120 },
    heightCm: { type: Number, min: 50, max: 250 },
    weightKg: { type: Number, min: 10, max: 400 },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash the password whenever it is created or changed.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Safe shape that is returned to the client (never includes the password).
userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    age: this.age,
    heightCm: this.heightCm,
    weightKg: this.weightKg,
    avatarUrl: this.avatarUrl,
  };
};

module.exports = mongoose.model('User', userSchema);
