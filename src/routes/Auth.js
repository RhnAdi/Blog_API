const express = require ('express')
const app = express()
const router = express.Router()
const AuthController = require ('./../controllers/Auth')

router.post("/login", AuthController.loginAuth)

module.exports = router