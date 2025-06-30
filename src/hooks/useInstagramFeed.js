import { useState, useEffect, useCallback } from 'react';

const CONTENTFUL_SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

export const useInstagramFeed = () => {
	const [instagramPosts, setInstagramPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Función para convertir URL de Instagram a embed
	const getEmbedUrl = useCallback(instagramUrl => {
		if (!instagramUrl) return null;

		// Manejar diferentes formatos de URL de Instagram
		let embedUrl = instagramUrl;

		// Si la URL no termina en /, agregarla
		if (!embedUrl.endsWith('/')) {
			embedUrl += '/';
		}

		// Agregar embed al final
		if (!embedUrl.includes('/embed')) {
			embedUrl += 'embed';
		}

		return embedUrl;
	}, []);

	// Datos de fallback si Contentful no está disponible
	const getDefaultPosts = useCallback(
		() => [
			{
				id: 'default-1',
				title: 'Mi último proyecto',
				instagramUrl: 'https://www.instagram.com/reel/DIG2gOWt2lt/',
				embedUrl: 'https://www.instagram.com/reel/DIG2gOWt2lt/embed',
				description: 'Descubre mi último proyecto inmobiliario',
				isActive: true,
				order: 1
			},
			{
				id: 'default-2',
				title: 'LAY PROCENTE',
				instagramUrl: 'https://www.instagram.com/reel/DKXUPyLodQP/',
				embedUrl: 'https://www.instagram.com/reel/DKXUPyLodQP/embed',
				description: 'Consejos inmobiliarios importantes',
				isActive: true,
				order: 2
			},
			{
				id: 'default-3',
				title: 'HOY TENGO EL HONOR DE ESTAR',
				instagramUrl: 'https://www.instagram.com/reel/DKhhoIkto9G/',
				embedUrl: 'https://www.instagram.com/reel/DKhhoIkto9G/embed',
				description: 'Experiencias profesionales',
				isActive: true,
				order: 3
			}
		],
		[]
	);

	const fetchInstagramFeed = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/entries?content_type=instagramPost&access_token=${CONTENTFUL_ACCESS_TOKEN}&order=-sys.createdAt`
			);

			if (!response.ok) {
				throw new Error(`Error fetching Instagram posts: ${response.status}`);
			}

			const data = await response.json();

			// Transformar los datos de Contentful
			const posts = data.items.map(item => ({
				id: item.sys.id,
				title: item.fields.title || 'Instagram Post',
				instagramUrl: item.fields.instagramUrl,
				embedUrl: item.fields.instagramUrl
					? getEmbedUrl(item.fields.instagramUrl)
					: null,
				description: item.fields.description || '',
				isActive: item.fields.isActive !== false, // Por defecto true
				order: item.fields.order || 0,
				createdAt: item.sys.createdAt
			}));

			// Filtrar solo posts activos y ordenar
			const activePosts = posts
				.filter(post => post.isActive && post.instagramUrl)
				.sort((a, b) => a.order - b.order);

			setInstagramPosts(activePosts);
		} catch (err) {
			console.error('Error fetching Instagram posts:', err);
			setError(err.message);
			// En caso de error, usar datos de fallback
			setInstagramPosts(getDefaultPosts());
		} finally {
			setLoading(false);
		}
	}, [getEmbedUrl, getDefaultPosts]);

	useEffect(() => {
		fetchInstagramFeed();
	}, [fetchInstagramFeed]);

	return {
		instagramPosts,
		loading,
		error,
		refetch: fetchInstagramFeed,
		getEmbedUrl
	};
};
