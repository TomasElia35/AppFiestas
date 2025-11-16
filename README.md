# AppFiesta

- Para generar tokens a los registros en el json debemos ejecutar lo siguiente:

node generarTokens.js

- Para generar los Qrs y guardalos en una carpeta ejecutar lo siguiente:

node generarQrs.js

Para correr la aplicacion debemos ejecuurtar esto es las siguientes consolas:

Terminal 1: npx json-server --watch database/db.json 
Terminal 2: local-ssl-proxy --source 3001 --target 3000
Terminal 3: npm start


