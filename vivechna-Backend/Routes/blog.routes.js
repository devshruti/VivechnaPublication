const express = require("express");
const { BlogModel } = require("../models/blog.model");

const blogRouter = express.Router();

blogRouter.get("/", async (req, res) => {
    try {
        const blogs = await BlogModel.find({ id: req.body._id })
        res.status(200).json(blogs)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

blogRouter.post("/add", async (req, res) => {
    try {
        const blog = new BlogModel(req.body)
        await blog.save()
        res.status(200).json({ msg: "New blog added", blog: req.body })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

blogRouter.patch("/edit/:id", async (req, res) => {
    const blogId = req.params.id;
    const updatedData = req.body;
    try {
        const blog = await BlogModel.findByIdAndUpdate(blogId, updatedData, { new: true });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(400).send({ message: "Unable to update blog", error: error.message });
    }
})

blogRouter.delete("/delete/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        await BlogModel.findByIdAndDelete(productId); // Pass productId directly as a string
        res.status(200).json({ message: `The blog of ${productId} is deleted successfully` });
    } catch (error) {
        res.status(400).send({ message: "Unable to delete blog", error: error.message });
    }
})

module.exports = {
    blogRouter
}
