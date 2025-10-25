const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

/**
 * Cliente FTP para descargar archivos de Idealista
 */
class IdealistaFTPClient {
  constructor() {
    this.config = {
      host: (process.env.IDEALISTA_FTP_HOST || 'ftp.habitania.com').replace(/^ftp:\/\//, ''),
      user: process.env.IDEALISTA_FTP_USER || '',
      password: process.env.IDEALISTA_FTP_PASSWORD || '',
      secure: false,
      port: 21
    };
  }

  /**
   * Descarga el archivo XML/JSON del FTP
   */
  async downloadFile(remoteFileName, localPath) {
    const client = new ftp.Client();

    try {
      console.log(`🔌 Conectando a ${this.config.host}...`);
      
      const config = { 
        ...this.config, 
        pasv: true  // Añadir modo pasivo explícitamente
      };
      
      await client.access(config);
      
      console.log(`✅ Conectado exitosamente`);
      console.log(`📥 Descargando ${remoteFileName}...`);
      
      await client.downloadTo(localPath, remoteFileName);
      
      console.log(`✅ Archivo descargado en ${localPath}`);
      
      return localPath;
    } catch (error) {
      console.error('❌ Error en descarga FTP:', error);
      throw error;
    } finally {
      client.close();
    }
  }

  /**
   * Lista los archivos disponibles en el FTP
   */
  async listFiles(remotePath = '/') {
    const client = new ftp.Client();
    
    try {
      console.log(`🔌 Conectando a ${this.config.host}...`);
      
      const config = { 
        ...this.config, 
        pasv: true  // Añadir modo pasivo explícitamente
      };
      
      await client.access(config);
      console.log('✅ Conectado exitosamente');
      
      const list = await client.list(remotePath);
      
      console.log('📂 Archivos disponibles:');
      list.forEach(file => {
        const size = file.size ? `${Math.round(file.size/1024)} KB` : 'N/A';
        console.log(`  📄 ${file.name} (${size})`);
      });
      
      return list;
    } catch (error) {
      console.error('❌ Error listando archivos:', error);
      throw error;
    } finally {
      client.close();
    }
  }

  /**
   * Descarga el archivo más reciente de Idealista
   */
  async downloadLatest() {
    const xmlPath = path.join(__dirname, '../xml-ftp/idealista-latest.xml');
    const jsonPath = path.join(__dirname, '../xml-ftp/idealista-latest.json');
    
    try {
      // Intentar descargar el archivo XML primero
      const xmlFileName = await this.findLatestFile('.xml');
      if (xmlFileName) {
        console.log(`📦 Descargando archivo XML: ${xmlFileName}`);
        await this.downloadFile(xmlFileName, xmlPath);
        return { format: 'xml', path: xmlPath };
      }
      
      // Si no hay XML, intentar JSON
      const jsonFileName = await this.findLatestFile('.json');
      if (jsonFileName) {
        console.log(`📦 Descargando archivo JSON: ${jsonFileName}`);
        await this.downloadFile(jsonFileName, jsonPath);
        return { format: 'json', path: jsonPath };
      }
      
      throw new Error('No se encontró ningún archivo XML o JSON en el FTP');
    } catch (error) {
      console.error('❌ Error descargando archivo:', error);
      throw error;
    }
  }

  /**
   * Busca el archivo más reciente con la extensión especificada
   */
  async findLatestFile(extension) {
    const client = new ftp.Client();
    
    try {
      await client.access(this.config);
      const list = await client.list('/');
      
      const files = list
        .filter(file => file.name.endsWith(extension) && !file.isDirectory)
        .sort((a, b) => b.modifiedAt - a.modifiedAt);
      
      if (files.length > 0) {
        return files[0].name;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error buscando archivos:', error);
      throw error;
    } finally {
      client.close();
    }
  }
}

// Uso del script
if (require.main === module) {
  const downloader = new IdealistaFTPClient();
  
  const command = process.argv[2];
  
  if (command === 'list') {
    // Listar archivos disponibles
    downloader.listFiles()
      .then(() => process.exit(0))
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  } else {
    // Descargar el archivo más reciente
    downloader.downloadLatest()
      .then(result => {
        console.log(`✅ Descarga completada: ${result.format} en ${result.path}`);
        process.exit(0);
      })
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  }
}

module.exports = IdealistaFTPClient;
