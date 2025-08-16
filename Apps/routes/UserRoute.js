const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, updateListRoomForUser, getUserBookings } = require('../controllers/UserController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/update').post(updateListRoomForUser);
router.route('/:id/bookings').get(getUserBookings);

module.exports = router;