const router = require("express").Router();

const UsersController = require("../controller/UsersController");
const { authMiddleware } = require("../helpers/authMidieware");

router.post("/save", UsersController.create);

router.get("/", authMiddleware , UsersController.read);

router.post("/login", UsersController.login);


module.exports = router;