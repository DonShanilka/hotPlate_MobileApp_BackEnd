const Auth = require('../model/AuthModel');
import bcrypt from 'bcrypt/bcrypt'

export async function AddUser(authData) {
    const hashPassword = await bcrypt.hash(Auth.password, 10);
    try {
        const added = new Auth({
            name: authData.name,
            emai: authData.emai,
            password: authData.password
        })
        const saved = await Auth.create(added);
        return saved;
    } catch (error) {
        console.log("Error Save Auth in AuthService: ", error);

    }
}


