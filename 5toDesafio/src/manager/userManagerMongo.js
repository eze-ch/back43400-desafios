import { User } from "../db/models/user.model.js";
import mongoose, {mongo} from 'mongoose';


class UserManager {

    async createUser(obj) {
        try { 
            //const newUser = await userModel.create(obj);
            const newUser = new User(obj);
            await newUser.save();
            return newUser;
        }
        catch(error) {return error}
    }


/*     async findUser(email, password) {
        try {
            const userFound = await User.findOne({email,password})
            console.log(`User Found - userManager: ${userFound.first_name}`)
            return userFound
        }
        catch(error) {return error}
    } */

    async findUser(email) {
        try {
            const userFound = await User.findOne({email})
            console.log(`User Found - userManager: ${userFound.first_name}`)
            return userFound
        }
        catch(error) {return error}
    } 
}

export {UserManager}