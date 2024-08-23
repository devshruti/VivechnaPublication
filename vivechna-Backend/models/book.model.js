const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    image: String,
    title: String,
    author: String,
    description: String,
    price: Number
})

const BookModel = mongoose.model("book", bookSchema)

module.exports = {
    BookModel
}