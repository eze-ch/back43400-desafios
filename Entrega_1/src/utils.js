// aca van a ir herramientas que usaremos en todo el proyecto
//por ejemplo traemos hasta aca la funcion para obtener la url absoluta

import { dirname } from 'path';
import { fileURLToPath } from 'url';

//const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname)

export const __dirname = dirname(fileURLToPath(import.meta.url))