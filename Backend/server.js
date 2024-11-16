import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import userRouter from "./routes/userRouter.js"
import authRouter from "./routes/authRouter.js"
import booksRouter from "./routes/booksRouter.js"
import dbConnection from "./connections/dbConnection.js"


const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({ origin: "*" }))

dbConnection.then(() => {

    app.use('/api', (req, res, next) => {
        //request interceptor
        // const token = req.headers.authorization.split(" ")[1]
        // console.log({ token })

        //response interceptor
        const response = res.send.bind(res)
        res.send = (body) => {
            console.log({ body })
            return response(body)
        }

        next()
    })

    app.use("/auth", authRouter)
    app.use("/api/users", userRouter)
    app.use("/api/books", booksRouter)

})

app.listen(3000, () => {
    console.log("running on Port ::: 3000");
})