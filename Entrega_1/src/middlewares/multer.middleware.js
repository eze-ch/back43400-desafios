// este es un middleware externo de terceros que permite la carga de archivos al servidor. por lo tanto es necesario instalarlo con "npm i multer"
// ver documentacion del middleware en google npm multer: https://www.npmjs.com/package/multer

import multer from 'multer'
import { __dirname } from '../utils.js'

const storage = multer.diskStorage({
    //destino donde se guarda el archivo
    destination: function (req, file, cb) {
      cb(null, __dirname+'/public/images')
    },

    //nombre con el q quiero q se guarde la imagen
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  export const uploadFile = multer({ storage: storage })