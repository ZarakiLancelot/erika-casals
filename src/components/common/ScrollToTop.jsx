import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname, search } = useLocation();
	const prevLocationRef = useRef();

	useEffect(() => {
		const currentLocation = `${pathname}${search}`;

		// Solo hacer scroll si realmente cambió la ubicación
		if (prevLocationRef.current !== currentLocation) {
			prevLocationRef.current = currentLocation;

			// Múltiples estrategias para asegurar el scroll al top

			// Estrategia 1: Scroll inmediato
			window.scrollTo(0, 0);

			// Estrategia 2: Scroll después del renderizado
			setTimeout(() => {
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'instant'
				});
			}, 0);

			// Estrategia 3: Scroll después de que se complete el ciclo de renderizado
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 50);

			// Estrategia 4: Listener para cuando el documento esté listo
			const handleDocumentReady = () => {
				window.scrollTo(0, 0);
			};

			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', handleDocumentReady);
			} else {
				handleDocumentReady();
			}

			return () => {
				document.removeEventListener('DOMContentLoaded', handleDocumentReady);
			};
		}
	}, [pathname, search]);

	return null;
};

export default ScrollToTop;
