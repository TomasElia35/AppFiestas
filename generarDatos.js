const fs = require('fs');
const path = require('path');

// Ruta donde se guardará el archivo
const dbPath = path.join(__dirname, 'database', 'db.json');

console.log('Iniciando generación de 400 registros...');

const empleados = [];

for (let i = 1; i <= 400; i++) {
    // Generamos datos ficticios secuenciales
    empleados.push({
        id: i,
        nombre: `Invitado Ejemplo ${i}`,
        documento: `${20000000 + i}`, // Genera DNIs como 20000001, 20000002...
        Empresa: `Empresa ${(i % 5) + 1}`, // Asigna Empresa 1 a 5 rotativamente
        Sector: `Sector ${(i % 3) + 1}`,   // Asigna Sector 1 a 3 rotativamente
        Asistio: false,
        fechaAsistida: "",
        token: "" // Se deja vacío para generarlo después
    });
}

// Crear la estructura final del JSON
const data = { empleados: empleados };

// Escribir el archivo
try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), 'utf8');
    console.log(`✅ ¡Éxito! Se han generado 400 registros en: ${dbPath}`);
} catch (err) {
    console.error('Error al escribir el archivo:', err);
}