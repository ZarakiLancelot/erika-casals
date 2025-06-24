import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ScrollAnimation = ({
	children,
	delay = 0,
	duration = 0.6,
	y = 50,
	x = 0,
	scale = 1,
	once = true,
	threshold = 0.1,
	type = 'slideUp' // 'slideUp', 'slideLeft', 'slideRight', 'fadeIn', 'scaleIn'
}) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once, threshold });

	const getVariants = () => {
		switch (type) {
			case 'slideLeft':
				return {
					hidden: { opacity: 0, x: -y },
					visible: { opacity: 1, x: 0 }
				};
			case 'slideRight':
				return {
					hidden: { opacity: 0, x: y },
					visible: { opacity: 1, x: 0 }
				};
			case 'fadeIn':
				return {
					hidden: { opacity: 0 },
					visible: { opacity: 1 }
				};
			case 'scaleIn':
				return {
					hidden: { opacity: 0, scale: 0.8 },
					visible: { opacity: 1, scale: 1 }
				};
			case 'slideUp':
			default:
				return {
					hidden: { opacity: 0, y, x, scale },
					visible: { opacity: 1, y: 0, x: 0, scale: 1 }
				};
		}
	};

	return (
		<motion.div
			ref={ref}
			initial='hidden'
			animate={isInView ? 'visible' : 'hidden'}
			variants={getVariants()}
			transition={{
				duration,
				delay,
				ease: 'easeOut'
			}}
		>
			{children}
		</motion.div>
	);
};

export default ScrollAnimation;
