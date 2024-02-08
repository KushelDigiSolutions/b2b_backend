const express = require("express");
require('dotenv').config();
require('./db/conn');
const app = express();
const cors = require('cors');
const { upload, uploadToCloudinary } = require('./util/util');
const port = 5000 || process.env.PORT;

const userRouter = require("./routes/userRouter");
const projectRouter = require("./routes/projectRouter");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user",userRouter);
app.use("/project",projectRouter);

app.post('/upload', upload, async(req,res)=>{
    // var locaFilePath = req.file.path;

    var result1 = await uploadToCloudinary(locaFilePath);
    res.json({result1});
});


app.get("/",(req,res)=>{
    res.send("this");
})

app.listen(port, () => {
    console.log('Listening on ', port);
});
