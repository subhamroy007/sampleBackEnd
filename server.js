const express = require("express");

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { uploadFile, getFileStream } = require("./s3");

const app = express();

app.get("13.126.19.195:7000/images/:key", (req, res) => {
    console.log(req.params);
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
});

app.post(
    "13.126.19.195:7000/images",
    upload.single("image"),
    async (req, res) => {
        const file = req.file;
        console.log(file);

        // apply filter
        // resize

        const result = await uploadFile(file);
        await unlinkFile(file.path);
        console.log(result);
        res.send({ imagePath: `/images/${result.Key}` });
        // res.send("Working")
    }
);

app.listen(8080, () => console.log("listening on port 8080"));
