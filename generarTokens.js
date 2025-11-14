// Importar los módulos necesarios de Node.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Definir la ruta a tu base de datos
const dbPath = path.join(__dirname, 'database', 'db.json');

console.log('Iniciando generador de tokens...');

try {
  // 1. Leer el archivo db.json
  const dbJson = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(dbJson);

  let tokensGenerados = 0;
  let empleadosOmitidos = 0;

  // 2. Recorrer CADA empleado en el array 'empleados'
  if (data.empleados && Array.isArray(data.empleados)) {
    
    data.empleados.forEach(empleado => {
      
      // 👇 === ¡AQUÍ ESTÁ LA VALIDACIÓN! === 👇
      // Si el campo 'token' NO existe, es nulo, o es un string vacío...
      if (!empleado.token) {
        // ...entonces generamos uno nuevo.
        empleado.token = crypto.randomUUID();
        tokensGenerados++;
      } else {
        // ...de lo contrario, lo omitimos.
        empleadosOmitidos++;
      }
    });

    // 4. Convertir los datos actualizados de vuelta a JSON (formateado)
    const nuevoDbJson = JSON.stringify(data, null, 4);

    // 5. Escribir y guardar el archivo db.json
    fs.writeFileSync(dbPath, nuevoDbJson, 'utf8');

    console.log('-------------------------------------------');
    console.log('✅ ¡Proceso de tokens completado!');
    console.log(`  - ${tokensGenerados} tokens nuevos generados.`);
    console.log(`  - ${empleadosOmitidos} empleados omitidos (ya tenían token).`);
    console.log(`  - Archivo actualizado: ${dbPath}`);
    console.log('-------------------------------------------');


  } else {
    console.error('Error: No se encontró el array "empleados" en db.json');
  }

} catch (err) {
  console.error('Ha ocurrido un error inesperado:', err.message);
}