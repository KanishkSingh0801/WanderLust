const express = require("express");
const router = express.Router();

//Index - users
router.get("/", (req, res) => {
    res.send("Get of users")
})

//Show - users
router.get("/:id", (req, res) => {
    res.send("Get of show users")
})

//POST users
router.post("/:id", (req, res) => {
    res.send("Post of users");
})

//DELETE users
router.delete("/:id", (req, res) => {
    res.send("DELETE of users");
})

module.exports = router;