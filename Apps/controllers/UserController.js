const asyncHandler = require('../middlewares/async');
const { UserModel } = require('../models/UserModel');
const { Room } = require('../models/RoomModel');
const bcrypt = require('bcryptjs');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, userId, email, phone, password } = req.body;

    // Check for missing fields
    if (!firstName || !lastName || !userId || !email || !phone || !password) {
        return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    // Check if email or phone already exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email or phone number already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new UserModel({
        firstName,
        lastName,
        userId,
        email,
        phone,
        password: hashedPassword
    });

    const savedUser = await user.save();
    if (!savedUser) {
        return res.status(400).json({ success: false, message: 'Registration failed' });
    }

    res.status(201).json({ success: true, message: 'Registration successful' });
});

const loginUser = asyncHandler(async (req, res) => {
    const { emailOrPhone, password } = req.body;

    // Check for missing fields
    if (!emailOrPhone || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
    }

    // Find user by email or phone
    const user = await UserModel.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Email or phone number not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect password' });
    }

    // Return user info (excluding password)
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user.userId,
            email: user.email,
            phone: user.phone
        }
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        // Hiện tại không dùng JWT/session, chỉ trả về thành công
        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout failed:', error.message);
        res.status(500).json({ success: false, message: 'Logout failed: ' + error.message });
    }
});

const updateListRoomForUser = asyncHandler(async (req, res) => {
    try {
        const { roomId, userId, checkInDate, checkOutDate } = req.body;

        if (!userId || !roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const newRoom = {
            roomId: roomId,
            roomNumber: room.roomNumber,
            price: room.price,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate)
        };

        const updatedUser = await UserModel.findOneAndUpdate(
            { userId: userId },
            { $push: { RoomList: newRoom } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser.RoomList });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const getUserBookings = asyncHandler(async (req, res) => {
    const user = await UserModel.findOne({ userId: req.params.id });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user.RoomList });
});

module.exports = { registerUser, loginUser, logoutUser, updateListRoomForUser, getUserBookings };