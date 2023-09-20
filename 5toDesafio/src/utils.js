import {dirname} from 'path'
import { fileURLToPath } from 'url'


export const __dirname = dirname(fileURLToPath(import.meta.url))

// reemplazar <password> por mi clave creada en Atlas. Despues de mongodb.net/ debo poner el nombre de la DB q queremos acceder: clase14DB. Si no existe, la crea
export const URI = 'mongodb+srv://ezech:ezech@clustertest.gus75oq.mongodb.net/ecommerce?retryWrites=true&w=majority'