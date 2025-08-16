const asyncHandler = require("../middlewares/async");
const NotiModel = require("../models/NotiModel");

// Tạo thông báo mới
exports.createNoti = asyncHandler(async (req, res) => {
    const newNoti = new NotiModel(req.body);
    const savedNoti = await newNoti.save();
    if (!savedNoti) {
        return res.status(400).json({ success: false, message: "Create notification failed" });
    }
    res.status(200).json({ success: true, data: savedNoti });
});

// Lấy tất cả thông báo
exports.getAllNoti = asyncHandler(async (req, res) => {
    const notis = await NotiModel.find();
    res.status(200).json({ success: true, data: notis });
});

// Cập nhật tất cả thông báo (ví dụ bạn có logic riêng, hoặc cập nhật theo query)
exports.updateAllNoti = asyncHandler(async (req, res) => {
    const updateFields = { ...req.body };
    const result = await NotiModel.updateMany({}, { $set: updateFields });
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
});

// Xóa tất cả thông báo
exports.clearAllNotifications = asyncHandler(async (req, res) => {
    const result = await NotiModel.deleteMany({});
    res.status(200).json({ success: true, message: `${result.deletedCount} notifications deleted.` });
});
