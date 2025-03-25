const AuthService = require("../service/AuthService");

export const  addAuth = async (req, res) => {
    const authData = req.body;
    console.log("authData in AuthController: ", authData);

    try {
        const auth = await AuthService.AddUser(authData);
        console.log("auth ", auth);
        res.status(200).json(auth);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

