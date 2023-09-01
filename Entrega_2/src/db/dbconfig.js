import mongoose from 'mongoose'

// reemplazar <password> por mi clave creada en Atlas. Despues de mongodb.net/ debo poner el nombre de la DB q queremos acceder: clase14DB. Si no existe, la crea
const URI = 'mongodb+srv://ezech:ezech@clustertest.gus75oq.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(URI)
.then(() => console.log('Conectado a la DB'))
.catch(error => console.log(error))


