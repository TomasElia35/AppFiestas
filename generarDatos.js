const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx'); // Reutilizamos la librería que ya instalaste

// --- CONFIGURACIÓN ---
// Archivo de entrada (debe estar en la carpeta public)
const archivoEntrada = 'invitados.xlsx'; 
const inputPath = path.join(__dirname, 'public', archivoEntrada);
// Archivo de salida (la base de datos)
const dbPath = path.join(__dirname, 'database', 'db.json');

console.log(`📂 Buscando archivo en: ${inputPath}...`);

try {
    // 1. Verificar si el archivo existe
    if (!fs.existsSync(inputPath)) {
        throw new Error(`No se encontró el archivo "${archivoEntrada}" en la carpeta public.`);
    }

    // 2. Leer el archivo Excel
    const workbook = XLSX.readFile(inputPath);
    
    // Tomamos la primera hoja del libro
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 3. Convertir a JSON
    // Convertimos las filas del Excel a objetos de JavaScript
    const datosExcel = XLSX.utils.sheet_to_json(sheet);

    console.log(`📊 Se encontraron ${datosExcel.length} registros en el Excel.`);

    // 4. Mapear y Transformar los datos
    // Ajustamos los datos para que coincidan con la estructura de tu db.json
    const empleados = datosExcel.map((fila, index) => {
        return {
            // Generamos un ID secuencial nuevo
            id: index + 1,
            
            // Mapeamos las columnas (acepta mayúsculas o minúsculas por seguridad)
            nombre: fila['Nombre'] || fila['nombre'] || 'Sin Nombre',
            documento: String(fila['Documento'] || fila['documento'] || ''), // Forzamos a string
            Empresa: fila['Empresa'] || fila['empresa'] || 'Sin Empresa',
            Sector: fila['Sector'] || fila['sector'] || 'Sin Sector',
            
            // Valores por defecto para el sistema
            Asistio: false,
            fechaAsistida: "",
            token: "" // Se deja vacío para que 'generarTokens.js' lo rellene después
        };
    });

    // 5. Guardar en db.json
    const dataFinal = { empleados: empleados };
    fs.writeFileSync(dbPath, JSON.stringify(dataFinal, null, 4), 'utf8');

    console.log('----------------------------------------------------');
    console.log(`✅ ¡Éxito! Se importaron ${empleados.length} invitados.`);
    console.log(`💾 Base de datos actualizada en: ${dbPath}`);
    console.log('----------------------------------------------------');
    console.log('👉 PASO SIGUIENTE: Recuerda ejecutar "node generarTokens.js" y luego "node generarQRs.js"');

} catch (err) {
    console.error('❌ Error:', err.message);
}