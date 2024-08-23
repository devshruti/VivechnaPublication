const express = require("express");
const { BookModel } = require("../models/book.model");

const bookRouter = express.Router();

bookRouter.get("/", async (req, res) => {
    try {
        const books = await BookModel.find({ id: req.body._id })
        res.status(200).json(books)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

bookRouter.post("/add", async (req, res) => {
    try {
        const book = new BookModel(req.body)
        console.log(book._id)
        await book.save()
        res.status(200).json({ msg: "New book added", book: req.body })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

bookRouter.delete("/delete/:id", async (req, res) => {
    const productId = req.params.id;
    console.log(productId, req.body)
    try {
        await BookModel.findByIdAndDelete(productId); // Pass productId directly as a string
        res.status(200).json({ message: `The book of ${productId} is deleted successfully` });
    } catch (error) {
        res.status(400).send({ message: "Unable to delete book", error: error.message });
    }
})

module.exports = {
    bookRouter
}
