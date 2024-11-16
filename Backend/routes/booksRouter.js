import { Router } from "express"
import { createBook, getBooks, getBookById } from "../services/booksService.js"

const router = Router()

router.post("/create", createBook)
router.get("/", getBooks)
router.get("/:id", getBookById)

export default router