const express = require("express")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const morgan = require("morgan")
const helmet = require("helmet")

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB")
    }
)

dotenv.config()

app.use(express.json())
app.use(helmet)
app.use(morgan('dev'))


app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)
app.use('*', (req, res) => {
    res.json({
        "msg": "Page Not found",
        "statusCode": 404
    })
})
app.listen(8000, () => {
    console.log("Backend server running")
})
