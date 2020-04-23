const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    currency:
    {
        type: String,
        require: true
    
    },
    symbol:
    {
        type: String,
        require: true
    
    },
    isoCode:
    {
        type: String,
        require: true
    
    }
})

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = { Currency }