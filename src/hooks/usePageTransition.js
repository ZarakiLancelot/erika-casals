import { motion } from 'framer-motion';

// Hook personalizado para manejar las transiciones de página
export const usePageTransition = () => {
	// Variantes de animación para diferentes tipos de contenido
	const contentVariants = {
		initial: {
			opacity: 0,
			y: 30,
			scale: 0.98
		},
		in: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		out: {
			opacity: 0,
			y: -20,
			scale: 1.02
		}
	};

	// Variantes específicas para páginas de propiedades
	const propertiesVariants = {
		initial: {
			opacity: 0,
			x: 50,
			scale: 0.96
		},
		in: {
			opacity: 1,
			x: 0,
			scale: 1
		},
		out: {
			opacity: 0,
			x: -50,
			scale: 0.96
		}
	};

	// Variantes para la home
	const homeVariants = {
		initial: {
			opacity: 0,
			scale: 0.95,
			y: 40
		},
		in: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		out: {
			opacity: 0,
			scale: 1.05,
			y: -20
		}
	};

	// Configuración de transición optimizada
	const transition = {
		type: 'tween',
		ease: [0.43, 0.13, 0.23, 0.96],
		duration: 0.4
	};

	return {
		contentVariants,
		propertiesVariants,
		homeVariants,
		transition,
		MotionDiv: motion.div
	};
};
