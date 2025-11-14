// Importar los módulos necesarios
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// --- Configuración ---
// Ruta a tu base de datos
const dbPath = path.join(__dirname, 'database', 'db.json');
// Carpeta donde se guardarán las imágenes QR
const outputDir = path.join(__dirname, 'qrcodes');
// --------------------

/**
 * Función principal autoejecutable
 */
async function generarCodigosQR() {
  console.log('Iniciando la generación de códigos QR...');
  let qrsGenerados = 0;
  let qrsOmitidos = 0;

  try {
    // 1. Asegurarse de que la carpeta de salida exista
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Carpeta creada en: ${outputDir}`);
    }

    // 2. Leer y parsear el archivo db.json
    const dbJson = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(dbJson);

    if (!data.empleados || !Array.isArray(data.empleados)) {
      console.error('Error: No se encontró el array "empleados" en db.json');
      return;
    }

    // 3. Crear un array de promesas para todas las generaciones de QR
    const promesasGeneracion = data.empleados.map(empleado => {
      // Validar que el empleado tenga los datos necesarios
      if (!empleado.documento || !empleado.token) {
        console.warn(`Empleado con id ${empleado.id} (${empleado.nombre}) no tiene documento o token. Omitiendo.`);
        return Promise.resolve(); // Resuelve promesa vacía para no fallar
      }

      // 4. Definir el texto del QR (formato DNI,TOKEN)
      const textoQR = `${empleado.documento},${empleado.token}`;
      
      // 5. Definir el nombre del archivo (usaremos el DNI)
      const nombreArchivo = `${empleado.nombre}, ${empleado.documento}.png`;
      const rutaArchivo = path.join(outputDir, nombreArchivo);

      // 👇 === ¡AQUÍ ESTÁ LA VALIDACIÓN! === 👇
      // Si el archivo QR ya existe...
      if (fs.existsSync(rutaArchivo)) {
        // ...lo omitimos.
        console.log(`Omitiendo (ya existe): ${empleado.nombre} -> ${nombreArchivo}`);
        qrsOmitidos++;
        return Promise.resolve(); // Resuelve para no bloquear
      }

      // 6. Retornar la promesa de guardar el archivo
      return QRCode.toFile(rutaArchivo, textoQR)
        .then(() => {
          console.log(`QR generado para: ${empleado.nombre} -> ${nombreArchivo}`);
          qrsGenerados++;
        })
        .catch(err => {
          console.error(`Error generando QR para ${empleado.nombre}:`, err.message);
        });
    });

    // 7. Esperar a que todas las imágenes se guarden
    await Promise.all(promesasGeneracion);

    console.log('----------------------------------------------------');
    console.log(`🎉 ¡Proceso de QRs completado!`);
    console.log(`  - ${qrsGenerados} QRs nuevos generados.`);
    console.log(`  - ${qrsOmitidos} QRs omitidos (ya existían).`);
    console.log(`  - Carpeta de salida: "qrcodes"`);
    console.log('----------------------------------------------------');

  } catch (err) {
    console.error('Ha ocurrido un error inesperado durante el proceso:', err.message);
  }
}

// Ejecutar la función
generarCodigosQR();