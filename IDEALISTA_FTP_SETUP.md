# Sistema de Feed FTP de Idealista

Este sistema reemplaza las llamadas a la API de Idealista Partners por un sistema de archivos XML/JSON que se descarga **cada 8 horas** desde un servidor FTP.

## ✅ Ventajas sobre el sistema anterior

1. **Sin rate limits** - No más errores 429
2. **Más rápido** - Los datos están en archivos locales
3. **Sin autenticación OAuth2** - Sin problemas de tokens
4. **Cache natural** - El archivo se actualiza 3 veces al día (cada 8 horas)
5. **Más estable** - No depende de la disponibilidad de la API en tiempo real

## 📋 Información importante

- **Frecuencia de actualización**: El fichero se genera **cada 8 horas**
- **Solo un fichero**: Se deja un solo fichero en el FTP (sobrescribe el anterior)
- **Enumerados**: Todos los campos enumerados empiezan en 0 y se incrementan de 1 en 1
- **Tipos de dirección**:
  - `myAddress`: Dirección exacta completa (solo para tus propios anuncios)
  - `listingAddress`: Dirección pública con visibilidad controlada (anuncios de otros)
  - Campo antiguo `address` → **ya no se usa (viene como NULL)**

## 📋 Requisitos

1. Credenciales del FTP de Idealista (host, usuario, contraseña)
2. Node.js y npm instalados
3. Las siguientes dependencias (ya incluidas en package.json):
   - `xml2js` - Para parsear archivos XML
   - `basic-ftp` - Para descargar del FTP

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno en `.env`:
```bash
# FTP de Idealista
IDEALISTA_FTP_HOST=ftp.habitania.com
IDEALISTA_FTP_USER=tu_usuario
IDEALISTA_FTP_PASSWORD=tu_password
```

## 📖 Uso

### Opción 1: Script todo-en-uno (Recomendado)

Descarga, parsea y guarda todo automáticamente:

```bash
npm run update:idealista
```

Este comando:
1. Descarga el XML/JSON más reciente del FTP
2. Parsea y transforma las propiedades
3. Separa venta y alquiler
4. Guarda 3 archivos JSON en `/public`:
   - `idealista-properties-sale.json` (solo venta)
   - `idealista-properties-rent.json` (solo alquiler)
   - `idealista-properties-all.json` (todas)

### Opción 2: Comandos individuales

```bash
# Solo descargar del FTP
npm run download:idealista

# Solo parsear un XML local
npm run parse:idealista

# Listar archivos disponibles en el FTP
npm run download:idealista list
```

## 📁 Estructura de archivos

```
/
├── scripts/
│   ├── downloadIdealistaFTP.js     # Cliente FTP
│   ├── parseIdealistaXML.js        # Parser XML → JSON
│   └── updateIdealistaFeed.js      # Script completo
├── xml-ftp/
│   ├── idealista-latest.xml        # Último XML descargado
│   └── idealista-latest.json       # Último JSON descargado
└── public/
    ├── idealista-properties-sale.json   # Propiedades de venta
    ├── idealista-properties-rent.json   # Propiedades de alquiler
    └── idealista-properties-all.json    # Todas las propiedades
```

## 🔄 Automatización (Cron Job)

### Importante: Frecuencia de actualización

Idealista actualiza el fichero **cada 8 horas** (3 veces al día), por lo que tu cron job debería ejecutarse con esa frecuencia o menos:
- 00:00, 08:00, 16:00 (recomendado)
- O esperar 30 minutos después: 00:30, 08:30, 16:30

### En desarrollo (local)

Puedes configurar un cron job en tu sistema:

**Linux/Mac** (`crontab -e`):
```bash
# Ejecutar 3 veces al día (después de cada actualización de Idealista)
30 0,8,16 * * * cd /ruta/a/tu/proyecto && npm run update:idealista
```

**Windows** (Task Scheduler):
1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Programa: `node`
4. Argumentos: `scripts/updateIdealistaFeed.js`
5. Directorio: `D:\Proyectos\erika`
6. Programar para ejecutar 3 veces al día: 00:30, 08:30, 16:30

### En producción (Vercel)

Vercel no tiene cron jobs nativos, pero puedes usar:

**Opción A: Vercel Cron Jobs** (requiere plan Pro)
Agrega a `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/update-idealista",
    "schedule": "30 0,8,16 * * *"
  }]
}
```

**Opción B: GitHub Actions** (gratis)
Crea `.github/workflows/update-idealista.yml`:
```yaml
name: Update Idealista Feed
on:
  schedule:
    # Cada 8 horas: 00:30, 08:30, 16:30 UTC
    - cron: '30 0,8,16 * * *'
  workflow_dispatch:  # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run update:idealista
        env:
          IDEALISTA_FTP_HOST: ${{ secrets.IDEALISTA_FTP_HOST }}
          IDEALISTA_FTP_USER: ${{ secrets.IDEALISTA_FTP_USER }}
          IDEALISTA_FTP_PASSWORD: ${{ secrets.IDEALISTA_FTP_PASSWORD }}
      - run: git config user.name "GitHub Actions"
      - run: git config user.email "actions@github.com"
      - run: git add public/idealista-*.json
      - run: git commit -m "Update Idealista properties [automated]" || echo "No changes"
      - run: git push
```

**Opción C: Servicio externo** (EasyCron, cron-job.org)
Crea un endpoint `/api/update-idealista` y configura el servicio para llamarlo cada 8 horas.

## 🔌 Integración con tu aplicación

### Método 1: Leer archivos estáticos (Recomendado)

Modifica `useIdealistaProperties.js`:

```javascript
const fetchProperties = useCallback(async () => {
  setLoading(true);
  try {
    // Leer del archivo estático generado
    const response = await fetch('/idealista-properties-sale.json');
    const result = await response.json();
    
    setProperties(result.data.properties);
  } catch (err) {
    setError('Error cargando propiedades');
  } finally {
    setLoading(false);
  }
}, []);
```

### Método 2: API endpoint

Crea `api/properties-static.js`:

```javascript
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'public/idealista-properties-sale.json');
    const data = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Cache-Control', 's-maxage=3600'); // Cache 1 hora
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Error loading properties' });
  }
};
```

## 📊 Formato de datos

Las propiedades se transforman del formato XML de Idealista al formato que tu aplicación ya usa:

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "propertyId": "86788193",
        "reference": "ideal-00019",
        "operation": "sale",
        "price": 310000,
        "propertyType": "flat",
        "size": 75,
        "rooms": 2,
        "bathrooms": 2,
        "address": "Plaza de las Cortes 5, 28014",
        "addressVisibility": "show_address",
        "district": "Centro",
        "neighborhood": "Huertas-Cortes",
        "latitude": 40.4160483,
        "longitude": -3.6961457,
        "descriptions": [{
          "language": "es",
          "comment": "Descripción de la propiedad..."
        }],
        "images": [
          {
            "id": "710690830",
            "url": "https://img3.idealista.com/blur/HOME_WI_1500/0/id.pro.es.image.master/00/00/0c/710690830.jpg",
            "position": 1,
            "tag": "living_room"
          }
        ],
        "tours3D": [
          {
            "id": "655457",
            "url": "https://tour.example.com/...",
            "type": "3d"
          }
        ],
        "features": {
          "hasLift": true,
          "hasAirConditioning": true,
          "hasWardrobe": true
        },
        "floor": "7",
        "builtType": "second_hand_good_condition",
        "state": "active",
        "modificationDate": "2025-10-22T10:30:00.000Z",
        "creationDate": "2025-09-15T08:00:00.000Z",
        "source": "idealista-ftp",
        "status": "active"
      }
    ],
    "total": 150,
    "lastUpdate": "2025-10-22T10:30:00.000Z"
  }
}
```

### Campos importantes según la documentación:

- **operation**: `sale` (0), `rent` (1), `rent_to_own` (2)
- **addressVisibility**: `show_address` (0), `only_street_name` (1), `hidden_address` (2)
- **state**: `new` (0), `pending` (1), `active` (2), `inactive` (3), `error` (4)
- **builtType**: `new_development` (0), `second_hand_to_be_restored` (3), `second_hand_good_condition` (4), etc.
- **modificationDate/creationDate**: Timestamps en milisegundos UTC convertidos a ISO string

## 🐛 Troubleshooting

### Error: "Cannot connect to FTP"
- Verifica las credenciales en `.env`
- Comprueba que el host sea correcto (`ftp.habitania.com`)
- Verifica que no haya firewall bloqueando el puerto 21

### Error: "File not found"
- Asegúrate de que Idealista esté subiendo el archivo diariamente
- Usa `npm run download:idealista list` para ver archivos disponibles

### Las propiedades no se actualizan
- Verifica que el cron job esté ejecutándose
- Revisa los logs del script
- Comprueba que los archivos JSON en `/public` tengan fecha reciente

### Error de parsing XML
- Verifica que el archivo XML sea válido
- Comprueba que el formato sea el esperado por Idealista
- Revisa el archivo `xml-ftp/idealista-latest.xml`

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs de ejecución
2. Verifica las credenciales del FTP
3. Contacta con el soporte de Idealista para problemas del FTP

## 🔄 Migración desde el sistema anterior

Para migrar del sistema de API Partners al sistema FTP:

1. Instala las nuevas dependencias
2. Configura las variables FTP en `.env`
3. Ejecuta `npm run update:idealista` para probar
4. Configura el cron job para actualización diaria
5. Actualiza `useIdealistaProperties.js` para leer del JSON estático
6. (Opcional) Elimina el código antiguo de OAuth2 y API calls

**¡El nuevo sistema eliminará completamente los problemas de rate limit!**
