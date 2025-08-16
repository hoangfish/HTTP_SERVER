const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomId: { type: String, required: true, trim: true },
    roomNumber: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true }
}, { _id: true });

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10,11}$/, 'Phone number must be 10-11 digits']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    RoomList: {
        type: [RoomSchema],
        default: []
    },
});

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = { UserModel };