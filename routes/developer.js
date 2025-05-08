const { Router } = require("express")
const router = Router();
const developerCtrl = require("../controllers/developerController.js")

router.get("/create", developerCtrl.developer_create_get);
router.post("/create", developerCtrl.developer_create_post);


module.exports = router;