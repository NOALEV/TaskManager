const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});
    const Messages = mongoose.model('Messages', MessagesSchema);

module.exports = { Messages }