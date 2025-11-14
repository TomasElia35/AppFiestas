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

  // 2. Recorrer CADA empleado en el array 'empleados'
  if (data.empleados && Array.isArray(data.empleados)) {
    data.empleados.forEach(empleado => {
      // 3. Generar un token UUID (ej: a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6)
      empleado.token = crypto.randomUUID();
      tokensGenerados++;
    });

    // 4. Convertir los datos actualizados de vuelta a JSON (formateado)
    const nuevoDbJson = JSON.stringify(data, null, 4);

    // 5. Escribir y guardar el archivo db.json
    fs.writeFileSync(dbPath, nuevoDbJson, 'utf8');

    console.log(`¡Éxito! Se generaron y guardaron ${tokensGenerados} tokens en ${dbPath}`);

  } else {
    console.error('Error: No se encontró el array "empleados" en db.json');
  }

} catch (err) {
  console.error('Ha ocurrido un error inesperado:', err.message);
}