exports.loginAuth = (req, res, next) => {
    const {name, email, password} = req.body;
    const result = {
        message: "Login Berhasil",
        data : {
            name,
            email,
            password
        }
    }
    res.status(201).json(result)
    next()
}
