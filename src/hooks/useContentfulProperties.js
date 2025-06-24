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
