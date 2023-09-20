import { Router } from "express";
import {userMongo} from "../manager/userManagerMongo.js";
import session from "express-session";
import { URI } from '../utils.js';
import MongoStore from "connect-mongo";


const router = Router();

/* router.get("/", async (req,res)=>{
    const email = "chau"
    req.session['email'] = email
    console.log(req.session.email )
    res.send("Hola mundo")

}) 
 */

router.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 600
    }),
    secret: "secret",
    resave:false,
    saveUninitialized:false,
}))

router.post('/', async (req, res) => {
    const { last_name, first_name, email, age, password } = req.body
    if (!last_name || !first_name || !email || !age || !password) {
        res.status(400).json({ message: "complete all teh fields" })
    }
    const userExist = await userMongo.findUser(email)
    if (userExist) {
        res.status(400).json({ message: "plase use other mail" })
    }
    const user = await userMongo.createUser(req.body)
    res.status(200).json({ message: `user created: ${user}` })
    
}
)



router.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        res.status(400).json({ message: "complete all teh fields" })
    }
    const userExist = await userMongo.findUser(email)
    if (!userExist) {
        res.status(400).json({ message: "Some data is wrong" })
    }
    if (userExist.password !== password) {
        res.status(400).json({ message: "Some data is wrong" })
    }
    req.session['email'] = email
    res.status(200).redirect("/index")
})

router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.clearCookie("connect.sid").redirect("/")
})

export default router;
