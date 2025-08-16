const express = require("express");
const router = express.Router();

const {
    getAllNoti,
    createNoti,
    clearAllNotifications,
    updateAllNoti
} = require("../controllers/NotiController");

router.route("/")
    .post(createNoti)
    .get(getAllNoti)
    .put(updateAllNoti);

router.delete('/delAll1', clearAllNotifications);

module.exports = router;
