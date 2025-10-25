# Referencia de Enumerados de Idealista

Este documento lista los valores enumerados del XML/JSON de Idealista según su documentación oficial.

**IMPORTANTE**: Todos los enumerados empiezan en 0 y se incrementan de 1 en 1.

## Enumerados principales

### Operation (Operación)
```
0 = SALE (venta)
1 = RENT (alquiler)
2 = RENT_TO_OWN (alquiler con opción a compra)
```

### TypologyType (Tipo de inmueble)
```
0  = HOME (vivienda/piso)
1  = CHALET
2  = COUNTRYHOUSE (casa de campo)
3  = GARAGE
4  = OFFICE (oficina)
5  = WAREHOUSE (almacén)
6  = ROOM (habitación)
7  = LAND (terreno)
8  = VACATIONAL (vacacional)
9  = NEW_DEVELOPMENT (obra nueva)
10 = CUSTOM_AD (anuncio personalizado)
11 = STORAGEROOM (trastero)
12 = BUILDING (edificio)
```

### AddressVisibility (Visibilidad dirección)
```
0 = SHOW_ADDRESS (mostrar dirección completa)
1 = ONLY_STREET_NAME (solo nombre de calle)
2 = HIDDEN_ADDRESS (dirección oculta)
```

### State (Estado del anuncio)
```
0 = NEW (nuevo)
1 = PENDING (pendiente)
2 = ACTIVE (activo)
3 = INACTIVE (inactivo)
4 = ERROR (error)
```

### BuiltType (Tipo de construcción)
```
0 = NEW_DEVELOPMENT (obra nueva)
1 = NEW_DEVELOPMENT_IN_CONSTRUCTION (obra nueva en construcción)
2 = NEW_DEVELOPMENT_FINISHED (obra nueva terminada)
3 = SECOND_HAND_TO_BE_RESTORED (segunda mano para restaurar)
4 = SECOND_HAND_GOOD_CONDITION (segunda mano en buen estado)
```

### EnergyCertification (Certificación energética)
```
0  = EXEMPT (exento)
1  = A1
2  = A2
3  = A3
4  = A4
5  = A
6  = B
7  = B_MINUS (B-)
8  = C
9  = D
10 = E
11 = F
12 = G
13 = UNKNOWN (desconocido)
14 = IN_PROCESS (en trámite)
15 = A_PLUS (A+)
```

### FlatSubType (Subtipo de piso)
```
0 = PENTHOUSE (ático)
1 = DUPLEX
```

### Language (Idioma)
```
0  = SPANISH (español)
1  = ENGLISH (inglés)
2  = FRENCH (francés)
3  = GERMAN (alemán)
4  = PORTUGUESE (portugués)
5  = ITALIAN (italiano)
6  = CATALAN (catalán)
7  = RUSSIAN (ruso)
8  = CHINESE (chino)
9  = EUSKERA (euskera)
10 = FINNISH (finés)
11 = DUTCH (holandés)
12 = POLISH (polaco)
13 = ROMANIAN (rumano)
14 = SWEDISH (sueco)
15 = DANISH (danés)
16 = NORWAY (noruego)
17 = GREEK (griego)
```

### MultimediaTag (Etiqueta de foto)
```
0  = UNKNOWN
1  = KITCHEN (cocina)
2  = BATHROOM (baño)
3  = LIVING_ROOM (salón)
4  = BEDROOM (dormitorio)
5  = HALL (recibidor)
6  = CORRIDOR (pasillo)
7  = TERRACE (terraza)
8  = YARD (patio)
9  = FACADE (fachada)
10 = GARDEN (jardín)
11 = VIEWS (vistas)
12 = PLAN (plano)
13 = DETAILS (detalles)
14 = FLAT_MATES (compañeros de piso)
15 = EMPTY_PARKING_SPACE (plaza de parking vacía)
16 = USED_PARKING_SPACE (plaza de parking ocupada)
17 = INPUT_OUTPUT (entrada/salida)
18 = STORE (tienda)
19 = ROOMS (habitaciones)
20 = RECEPTION (recepción)
21 = WAITING_ROOM (sala de espera)
22 = OFFICE (oficina)
23 = ARCHIVE (archivo)
24 = PARKING_SPACE (parking)
25 = ATTIC (desván)
26 = SWIMMING_POOL (piscina)
27 = DINING_ROOM (comedor)
28 = ENTRANCE (entrada)
29 = LAND (terreno)
30 = URBAN_PLOT (parcela urbana)
31 = SURROUNDING_AREA (zona circundante)
32 = JUNK_ROOM (cuarto trastero)
33 = PENTHOUSE (ático)
34 = BALCONY (balcón)
35 = BUILDING_WORK (obra)
36 = PRESS_PHOTO (foto de prensa)
37 = STUDIO (estudio)
```

### Ad3DTourGroup (Tipo de tour)
```
0 = THREE_D (tour 3D)
1 = VIRTUAL_TOUR (tour virtual)
2 = ND_TOP_TOUR (tour destacado obra nueva)
```

### ZoneLevel (Nivel geográfico)
```
0  = LEVEL0 (Mundo)
1  = LEVEL1 (Continente - ej: 0-EU)
2  = LEVEL2 (País - ej: 0-EU-ES España)
3  = LEVEL3 (Provincia - ej: 0-EU-ES-28 Madrid)
4  = LEVEL4 (Área de provincia - ej: 0-EU-ES-28-07 Madrid capital)
5  = LEVEL5 (Subárea)
6  = LEVEL6 (Localidad)
7  = LEVEL7 (Zona/Distrito)
8  = LEVEL8 (Barrio)
9  = LEVEL9 (No aplica)
10 = LEVEL10 (No aplica)
```

## Tipos de calle (streetTypeId)

```
1  = Acceso
2  = Alameda
3  = Alto
4  = Arco
6  = Autopista
7  = Avenida
12 = Calle
15 = Callejón
18 = Camino
24 = Carretera
31 = Paseo
34 = Puente
36 = Plaza
40 = Rotonda
42 = Travesía
45 = Vía
47 = Desconocida
51 = Galería
59 = Bulevar
60 = Costanilla
61 = Carril
62 = Cuesta
63 = Glorieta
64 = Pozo
65 = Prolongación
66 = Puerta
67 = Pasaje
68 = Rambla
69 = Ronda
70 = Senda
71 = Vereda
72 = Autovía
73 = Circunvalación
74 = Riera
75 = Impasse
```

## Campos especiales

### FloorType (Tipo de suelo)
```
2  = PARQUET
3  = GRES
4  = MARMOL
6  = TERRAZO
8  = CERAMICA
10 = BALDOSA
16 = TARIMA
```

### AirConditioning (Aire acondicionado)
```
0 = NOT_AVAILABLE (no disponible)
1 = COLD (frío)
2 = COLD_HEAT (frío/calor)
3 = PREINSTALLATION (preinstalación)
```

### BathRoom (Tipo de baño)
```
0 = TOILETS (aseos)
1 = FULL_EQUIPED (equipado completo)
2 = BOTH (ambos)
```

### Orientation (Orientación)
```
0 = NORTH (norte)
1 = SOUTH (sur)
2 = WEST (oeste)
3 = EAST (este)
```

## Campos booleanos

Todos los booleanos suelen empezar por `has`:
- `hasLift` (tiene ascensor)
- `hasAirConditioning` (tiene aire acondicionado)
- `hasWardrobe` (tiene armarios)
- `hasTerrace` (tiene terraza)
- `hasGarden` (tiene jardín)
- `hasSwimmingPool` (tiene piscina)
- `hasParkingSpace` (tiene plaza de parking)
- etc.

Valores: `true` o `false`

## Campos de fecha

### modification y creation
Son timestamps en **milisegundos UTC** (long).

Conversión en JavaScript:
```javascript
const modificationDate = new Date(parseInt(modification));
const creationDate = new Date(parseInt(creation));
```

## Estructura de direcciones (actualización 5 agosto 2024)

### myAddress (anuncios propios)
Dirección completa con todos los campos disponibles:
```xml
<myAddress>
  <street>
    <typeId>36</typeId>
    <name>Plaza de las Cortes</name>
    <number>5</number>
  </street>
  <coordinates>
    <longitude>-3.6961457</longitude>
    <latitude>40.4160483</latitude>
  </coordinates>
  <postalCode>28014</postalCode>
  <floorNumber>7</floorNumber>
</myAddress>
```

### listingAddress (anuncios de otros)
Dirección con visibilidad controlada. Campos pueden tener `reason` si están ocultos:
```xml
<listingAddress>
  <visibility>0</visibility> <!-- 0=completa, 1=solo calle, 2=oculta -->
  <coordinates>
    <longitude>-3.6961457</longitude>
    <latitude>40.4160483</latitude>
  </coordinates>
  <street>
    <value>
      <typeId>36</typeId>
      <name>Plaza de las Cortes</name>
      <number>
        <value>5</value>
        <reason/> <!-- Si tiene reason=1, el campo está oculto -->
      </number>
    </value>
  </street>
</listingAddress>
```

### ReasonType (motivo de ocultación)
```
0 = HIDDEN (oculto)
1 = NO_PRESENT (no presente)
```

## Tours 3D (añadido 29 mayo 2023)

```xml
<Ad3DTours>
  <id>655457</id>
  <url>https://...</url>
  <group>0</group> <!-- 0=3D, 1=VIRTUAL_TOUR, 2=ND_TOP_TOUR -->
</Ad3DTours>
```

## Notas importantes

1. **Todos los enums empiezan en 0**, no en 1
2. El campo antiguo `address` ya **no se usa** (viene NULL)
3. Ahora se usa `myAddress` (propios) o `listingAddress` (otros)
4. El nodo `location` se sacó de `address` y está al mismo nivel
5. El fichero se actualiza **cada 8 horas** (no diariamente)
6. Solo hay **un fichero** en el FTP (sobrescribe el anterior)
