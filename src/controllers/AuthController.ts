const AuthService = require("../service/AuthService");

const  addAuth = async (req, res) => {
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

const updateAuth = async (req, res) => {
    try {
        const {id} = req.params;
        const authData = req.body;

        const updateAuth = await AuthService.UpdateUser(id, authData);

        if (!updateAuth) {
            return res.status(400).json({error: "Auth Not Found"});
        }

        res.status(200).json(updateAuth);
    } catch (error) {
        res.status(500).json({error: "Failed to Update Auth"})
    }
}

module.exports = {addAuth, updateAuth}