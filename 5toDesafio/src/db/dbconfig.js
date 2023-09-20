import mongoose from 'mongoose'
import { URI } from '../utils.js'

//const URI = 'mongodb+srv://ezech:ezech@clustertest.gus75oq.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(URI)
.then(() => console.log('Conectado a la DB'))
.catch(error => console.log(error))


