import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {timestamps: true});

const booksModel = mongoose.model('books', bookSchema);

export default booksModel