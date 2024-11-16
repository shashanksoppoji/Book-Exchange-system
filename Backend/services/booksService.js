import BooksModel from "../models/BooksModel.js"
import UserModel from "../models/UserModel.js"

export const createBook = async (req, res) => {
    try {
        const { title, author, genre, userId } = req.body

        const newBook = new BooksModel({ title, author, genre, userId })
        await newBook.save()

        await UserModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    books: {
                        bookId: newBook._id,
                        condition: "New",
                        status: "Available"
                    }
                }
            }
        )

        res.status(201).json({ message: "Book created successfully", book: newBook })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getBooks = async (req, res) => {
    try {
        const books = await BooksModel.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await BooksModel.findById(id);
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        res.status(200).json(book);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        res.status(500).json({ message: error.message });
    }
}
