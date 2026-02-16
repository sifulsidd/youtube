import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json()) // to send json bodies in post requests 

app.post("/process-video", (req, res) => {
    // Get path of input video file from request body 
    const inputFilePath = req.body.inputFilePath;
    // Define output file path
    const outputFilePath = req.body.outputFilePath;

    // console.log(`inputFilePath : ${inputFilePath}`)
    // console.log(`outputFilePath: ${outputFilePath}`)

    if(!inputFilePath) {
        res.status(400).send("Bad request: Missing input file path");
    }
    if(!outputFilePath) {
        res.status(400).send("Bad request: Missing output file path");
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // convert into 360p
        .on("end", () => {
            return res.status(200).send("Video processing finished successfully")
        })
        .on("error", (err)=>{
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});