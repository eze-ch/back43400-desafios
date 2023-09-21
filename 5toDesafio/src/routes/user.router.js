import { Router } from "express";
import {UserManager} from "../manager/userManagerMongo.js";
import session from "express-session";
import { URI } from '../utils.js';
import MongoStore from "connect-mongo";


const router = Router();
const userManagerInstance = new UserManager();


/* router.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 600
    }),
    secret: "secret",
    resave:false,
    saveUninitialized:false,
})) */

router.post('/register', async (req, res) => {
    const { last_name, first_name, email, age, password } = req.body
    if (!last_name || !first_name || !email || !age || !password) {
        res.status(400).json({ message: "complete all teh fields" })
    }
    const userExist = await userManagerInstance.findUser(email)
    if (userExist) {
        res.status(400).json({ message: "plase use other mail" })
    }
    const user = await userManagerInstance.createUser(req.body)
    res.status(200).json({ message: `user created: ${user}` })
    
})



router.post('/login', async (req, res) => {
    const { email, password } = req.body
    console.log(`email: ${email} - Password: ${password}`)
    
    if (!email || !password) {
        res.status(400).json({ message: "complete all teh fields" })
    }
/*     const user = await userManagerInstance.findUser({email,password})
    console.log(user)
    if(!user)  res.status(400).json({ messge: "Some data is wrong" })
    console.log(`User Found: ${user.first_name}`) */

    const user = await userManagerInstance.findUser(email)
    console.log(user)
    if (!user) {
        res.status(400).json({ messge: "Some data is wrong" })
    }
    if (user.password !== password) {
        res.status(400).json({ messge: "Some data is wrong" })
    }

    req.session.user = {
        name : `${user.first_name} ${user.last_name}`,
        email : user.email
    }

    console.log(`Datos de sesion UserRoutes: ${req.session.cookie.name}`)

    //res.status(200)
    //req.session['email'] = email
    res.status(200).redirect("/index")
})


router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.clearCookie("connect.sid").redirect("/")
})

export default router;
