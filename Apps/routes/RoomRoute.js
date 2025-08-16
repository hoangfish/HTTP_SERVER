const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, deleteRoom, bookRoom , updateRoomStatus} = require('../controllers/RoomController');

router.route('/').get(getRooms).post(createRoom);
router.route('/:id').get(getRoomById).delete(deleteRoom);
router.route('/book').post(bookRoom);
router.route('/update/:id').post(updateRoomStatus);

module.exports = router;