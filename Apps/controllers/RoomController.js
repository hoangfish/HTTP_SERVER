const asyncHandler = require('../middlewares/async');
const { Room } = require('../models/RoomModel');

const getRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find();
    res.status(200).json({
        success: true,
        data: rooms
    });
});

const getRoomById = asyncHandler(async (req, res) => {
    const room = await Room.findOne({ roomId: req.params.id });
    if (!room) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
    }
    res.status(200).json({
        success: true,
        data: room
    });
});

const createRoom = asyncHandler(async (req, res) => {
    const { roomId, roomNumber, status, bedCount, roomType, price, description, image, guests, area } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!roomId || !roomNumber || !bedCount || !roomType || !price || !description || !image || !guests || !area) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields: roomId, roomNumber, bedCount, roomType, price, description, image, guests, area'
        });
    }

    // Kiểm tra roomType hợp lệ
    const validRoomTypes = ['single', 'double', 'family'];
    if (!validRoomTypes.includes(roomType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid roomType. Must be one of: single, double, family'
        });
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ['available', 'booked'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be one of: available, booked'
        });
    }

    // Kiểm tra roomId và roomNumber đã tồn tại
    const existingRoom = await Room.findOne({ $or: [{ roomId }, { roomNumber }] });
    if (existingRoom) {
        return res.status(400).json({
            success: false,
            message: 'roomId or roomNumber already exists'
        });
    }

    const room = new Room({
        roomId,
        roomNumber,
        status: status || 'available',
        bedCount,
        roomType,
        price,
        description,
        image,
        guests,
        area
    });

    await room.save();

    res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: room
    });
});

const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findOne({ roomId: req.params.id });
    if (!room) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
    }

    await room.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
        data: { roomId: req.params.id }
    });
});

const bookRoom = asyncHandler(async (req, res) => {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide roomId and userId'
        });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
    }

    if (room.status === 'booked') {
        return res.status(400).json({
            success: false,
            message: 'Room is already booked'
        });
    }

    room.status = 'booked';
    await room.save();

    res.status(200).json({
        success: true,
        message: 'Room booked successfully',
        data: {
            roomId,
            roomNumber: room.roomNumber
        }
    });
});

const updateRoomStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status || !['available', 'booked'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be one of: available, booked'
        });
    }

    const room = await Room.findOneAndUpdate(
        { roomId: req.params.id },
        { status },
        { new: true, runValidators: true }
    );

    if (!room) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
    }

    res.status(200).json({
        success: true,
        data: room
    });
});

module.exports = { getRooms, getRoomById, createRoom, deleteRoom, bookRoom, updateRoomStatus };