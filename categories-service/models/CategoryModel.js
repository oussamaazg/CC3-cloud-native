const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema(
    {
        name: { type: String, required: true }
    },{colletion:"categories"}
)

module.exports = mongoose.model('Product', CategorySchema);