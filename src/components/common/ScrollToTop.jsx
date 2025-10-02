import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		// Scroll al top cuando cambie la ruta
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
};

export default ScrollToTop;
