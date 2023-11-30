const router = require("express").Router();

const PersonsController = require("../controller/PersonsController");
const imageUpload = require("../helpers/imageUpload");

router.get("/", PersonsController.read);

router.post("/", imageUpload.single('foto'), PersonsController.create);

router.put("/:id", PersonsController.update);

router.get("/:id", PersonsController.readById);

router.delete("/:id", PersonsController.del);

module.exports = router;
