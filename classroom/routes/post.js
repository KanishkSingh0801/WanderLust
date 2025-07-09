const express = require("express");
const router = express.Router();

//POSTS
//Index - 
router.get("/", (req, res) => {
    res.send("Get of posts")
})

//Show - 
router.get("/:id", (req, res) => {
    res.send("Get of show posts")
})

//Show 
router.post("/:id", (req, res) => {
    res.send("Post of posts");
})

//DELETE 
router.delete("/:id", (req, res) => {
    res.send("DELETE of posts");
})

module.exports = router;