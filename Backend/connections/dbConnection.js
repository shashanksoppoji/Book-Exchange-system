import mongoose from "mongoose"

const connection = mongoose.connect('mongodb://localhost:27017/BookExchangeSystem?authSource=admin')

export default connection