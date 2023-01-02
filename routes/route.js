const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const middleware = require("../middleware/auth")


//...........................user..............................//

router.post("/signup", userController.createUser)

router.post("/login", userController.login)

router.get("/getUser",middleware.tokenChecker, userController.getUser)



module.exports = router;  
