const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    image: String,
    date: String,
    title: String,
    author: String,
    content: String,
    description: String
})

const BlogModel = mongoose.model("blog", blogSchema)

module.exports = {
    BlogModel
}