// el middleware es una funcion.. por lo tanto la exporto como tal
// estos reciben un parametro extra: next. Que define si se permite avanzar o no

// este es un middleware de ruta... es decir bloque el acceso al endpoint
export const authMiddleware = (req, res, next) => {
    const { role } = req.body
    console.log('ROLE',req.body);

    if (role === 'ADMIN') {
      next() // permite el avance de la funcion.. por eso se pone justo antes de la llamada de la funcion del endpoint
    } else {
        // si no esta autorizado, le envio la respuesta del servidor directamente (res).. en este caso un mensaje de acceso denegado
      res.status(401).send('Not authorized')
    }
  }