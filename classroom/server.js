const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.get('/', (req, res) => {
    res.send("Hi, i am root");
})

app.use("/users", users); //Iski vajah se / ke baad ka jo bhi URL hoga, voh pehle user ke router se match hoga

app.use("/posts", posts);

app.listen(3000, () => {
    console.log("Port is listening on 3000");
})