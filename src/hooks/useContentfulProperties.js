import { useState, useEffect, useCallback } from 'react';
import {
	getProperties,
	getProperty,
	getFeaturedProperties
} from '../services/contentful';

export const useContentfulProperties = (type = null) => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchProperties = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getProperties(type);
			setProperties(data);
		} catch (err) {
			setError(err.message);
			setProperties([]);
		} finally {
			setLoading(false);
		}
	}, [type]);

	useEffect(() => {
		fetchProperties();
	}, [fetchProperties]);

	return { properties, loading, error, refetch: fetchProperties };
};

export const useContentfulProperty = id => {
	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!id) return;

		const fetchProperty = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getProperty(id);
				setProperty(data);
			} catch (err) {
				setError(err.message);
				setProperty(null);
			} finally {
				setLoading(false);
			}
		};

		fetchProperty();
	}, [id]);

	return { property, loading, error };
};

export const useFeaturedProperties = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeaturedProperties = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getFeaturedProperties();
				setProperties(data);
			} catch (err) {
				setError(err.message);
				setProperties([]);
			} finally {
				setLoading(false);
			}
		};

		fetchFeaturedProperties();
	}, []);
	return { properties, loading, error };
};

// Hooks específicos para cada tipo
export const useContentfulSaleProperties = () => {
	return useContentfulProperties('En venta');
};

export const useContentfulRentProperties = () => {
	return useContentfulProperties('En alquiler');
};

// Hook para obtener nuevos desarrollos del backend
export const useNewDevelopments = () => {
	const [newDevelopments, setNewDevelopments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// useCallback para obtener nuevos desarrollos
	const fetchNewDevelopments = useCallback(async () => {
		setLoading(true);
		setError(null);
		
		try {
			// En producción usar rutas relativas, en desarrollo usar BACKEND_URL
			const baseUrl = import.meta.env.PROD
				? ''
				: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
			const url = `${baseUrl}/api/newDevelopments`;
			
			console.log('🏗️ Fetching new developments from:', url);
			
			const response = await fetch(url);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const result = await response.json();
			console.log('✅ New developments loaded:', result);
			
			if (result.success && result.data) {
				setNewDevelopments(result.data);
			} else {
				setNewDevelopments([]);
			}
		} catch (err) {
			console.error('❌ Error fetching new developments:', err);
			setError(err.message);
			setNewDevelopments([]);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		newDevelopments,
		loading,
		error,
		fetchNewDevelopments
	};
}
