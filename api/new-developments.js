// API /api/new-developments - Gestión de nuevos desarrollos (GET)
const fs = require('fs');
const path = require('path');
const { createClient } = require('contentful');

// Configuración del cliente de Contentful
let contentfulClient = null;
if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
  contentfulClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
  });
}

module.exports = async (req, res) => {
	try {
		console.log('🏗️ Obteniendo nuevos desarrollos desde Contentful y JSON...');

		let contentfulDevelopments = [];
		let jsonDevelopments = [];

		// 1. Cargar datos del archivo JSON
		try {
			const jsonPath = path.join(process.cwd(), 'backend', 'formatted_projects.json');
			
			if (fs.existsSync(jsonPath)) {
				const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
				jsonDevelopments = jsonData.projects || [];
				console.log(`📄 ${jsonDevelopments.length} proyectos cargados desde JSON`);
			} else {
				console.log('⚠️ Archivo formatted_projects.json no encontrado');
			}
		} catch (jsonError) {
			console.error('❌ Error cargando JSON:', jsonError.message);
		}

		// 2. Obtener datos de Contentful (si está configurado)
		if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
			try {
				const response = await contentfulClient.getEntries({
					content_type: 'propertiesPandaIdx',
					order: '-sys.createdAt',
					include: 2
				});

				contentfulDevelopments = response.items.map(item => {
					const description = item.fields.description || '';
					let location = '';
					if (description.toLowerCase().includes('miami')) {
						location = 'miami, brickell';
					} else if (description.toLowerCase().includes('florida')) {
						location = 'Florida';
					}

					return {
						id: item.sys.id,
						...item.fields,
						source: "newDevelopments",
						location: location || 'Florida',
						propertyZone: 'Florida',
						status: "available",
						price: item.fields.minPrice,
						images: item.fields.images?.map(image => ({
							url: image.fields?.file?.url ? `https:${image.fields.file.url}` : '',
							title: image.fields?.title || '',
							width: image.fields?.file?.details?.image?.width || 800,
							height: image.fields?.file?.details?.image?.height || 600
						})) || []
					};
				});

				console.log(`✅ ${contentfulDevelopments.length} desarrollos obtenidos desde Contentful`);
			} catch (contentfulError) {
				console.error('❌ Error obteniendo datos de Contentful:', contentfulError.message);
			}
		} else {
			console.log('⚠️ Contentful no configurado, usando solo datos del JSON');
		}

		// 4. Combinar ambas fuentes de datos
		const allDevelopments = [...contentfulDevelopments, ...jsonDevelopments];

		console.log(`🎯 Total: ${allDevelopments.length} desarrollos (${contentfulDevelopments.length} Contentful + ${jsonDevelopments.length} JSON)`);

		res.json({
			success: true,
			data: allDevelopments,
			total: allDevelopments.length,
			sources: {
				contentful: contentfulDevelopments.length,
				json: jsonDevelopments.length
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('❌ Error obteniendo nuevos desarrollos:', error);

		// Fallback con datos de ejemplo
		const mockNewDevelopments = [
			{
				id: 'mock-dev-001',
				title: 'Residencial Panda Gardens',
				description: 'Exclusivo desarrollo residencial con acabados de lujo',
				price: 350000,
				location: 'Madrid, Chamberí',
				type: 'Nuevo desarrollo',
				propertyType: 'Apartamento',
				rooms: 2,
				bathrooms: 2,
				size: 85,
				features: ['Terraza', 'Parking', 'Trastero', 'Piscina comunitaria'],
				images: [{
					url: '/images/home-image-1.png',
					title: 'Vista exterior',
					width: 800,
					height: 600
				}],
				status: 'available',
				featured: true,
				developer: 'Panda Developments',
				completionDate: '2025-12-31',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				source: 'contentful'
			}
		];

		res.json({
			success: true,
			data: mockNewDevelopments,
			total: mockNewDevelopments.length,
			timestamp: new Date().toISOString(),
			fallback: true,
			error: error.message
		});
	}
};