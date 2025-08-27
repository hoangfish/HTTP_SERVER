const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, deleteRoom, bookRoom, updateRoomStatus, createMultipleRooms, addCheckFlagsToRooms  } = require('../controllers/RoomController');

router.route('/').get(getRooms).post(createRoom);
router.route('/:id').get(getRoomById).delete(deleteRoom);
router.route('/book').post(bookRoom);
router.route('/update/:id').post(updateRoomStatus);
router.route('/bulk-create').post(createMultipleRooms);
router.route('/addCheck').put(addCheckFlagsToRooms);

module.exports = router;