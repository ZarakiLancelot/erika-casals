import { motion } from 'framer-motion';
import { usePageTransition } from '../../hooks/usePageTransition';

const PageTransition = ({ children, type = 'content' }) => {
	const { contentVariants, propertiesVariants, homeVariants, transition } =
		usePageTransition();

	// Seleccionar las variantes según el tipo de página
	const getVariants = () => {
		switch (type) {
			case 'properties':
				return contentVariants;
			case 'home':
				return contentVariants;
			default:
				return contentVariants;
		}
	};

	return (
		<motion.div
			initial='initial'
			animate='in'
			exit='out'
			variants={getVariants()}
			transition={transition}
			style={{ width: '100%', height: '100%' }}
		>
			{children}
		</motion.div>
	);
};

export default PageTransition;
