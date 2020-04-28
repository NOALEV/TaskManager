const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    category:
    {
        type: String,
        require: true
    
    },
    // with auth
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
}, { timestamps: true })

const List = mongoose.model('List', ListSchema);

module.exports = { List }

const List = mongoose.model('List', ListSchema);

module.exports = { List }