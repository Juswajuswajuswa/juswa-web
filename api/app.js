// first import important backend thingy like express
import express from 'express'
// after connecting to mongodb and downloading package of mongodb and mongoose 
// now import the mongoose
import mongoose from 'mongoose'
// import dotenv
import { configDotenv } from 'dotenv'
import authRoute from '../api/routes/auth.route.js'
import userRoute from '../api/routes/user.route.js'
import postRoute from '../api/routes/post.route.js'
import commentRoute from '../api/routes/comment.route.js'
// errorHandler middle ware to handle error and posssible error
// import cookie parser and use it 
import cookieParser from "cookie-parser";
// import cors 
import cors from 'cors'
// import path 
import path from 'path'

// start
// should always on the top
const app = express()
// to parse the request json to postman
app.use(express.json())
// cookie parser
app.use(cookieParser())
configDotenv()
//cors
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
// PORT
const PORT = process.env.PORT || 5000

const __dirname = path.resolve()


app.use(express.urlencoded({extended: true})) // to parse form data
// routers
// making routers 
app.use(`/api/post`, commentRoute)
app.use('/api/post', postRoute)
app.use('/api/auth', authRoute)
app.use(`/api/user`, userRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    })
}


// connecting node express to mongodb
const connect = () => {
    mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDb")
    })
    .catch  
}
app.listen(PORT, () => {
    connect()
    console.log(`Server is running on port ${PORT}`)
})

// middleware to handle error and potential error !MUST USE 
app.use((err, req, res ,next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    })
}
)