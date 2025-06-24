# ========================================
# DOCKERFILE PARA BACKEND - OPCIONAL
# Para usar en Docker o algunos hostings
# ========================================

FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["node", "server.js"]
