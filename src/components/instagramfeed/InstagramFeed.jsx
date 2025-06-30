import { useState } from 'react';
import { useInstagramFeed } from '../../hooks/useInstagramFeed';
import {
	StyledContainer,
	StyledContent,
	StyledHeader,
	StyledTitle,
	StyledDescription,
	StyledInstagramIcon,
	StyledSliderContainer,
	StyledSliderWrapper,
	StyledReelItem,
	StyledNavigationButton,
	StyledNavigationContainer
} from './styles';

const InstagramFeed = () => {
	const { instagramPosts, loading, error } = useInstagramFeed();
	const [currentSlide, setCurrentSlide] = useState(0);

	// Usar los posts de Contentful o los datos por defecto
	const reels = instagramPosts.length > 0 ? instagramPosts : [];

	// Calcular el máximo de slides basado en el número de posts
	const maxSlides = Math.max(0, reels.length - 2);

	const nextSlide = () => {
		setCurrentSlide(prev => (prev >= maxSlides ? 0 : prev + 1));
	};

	const prevSlide = () => {
		setCurrentSlide(prev => (prev === 0 ? maxSlides : prev - 1));
	};

	// Si está cargando, mostrar un indicador
	if (loading) {
		return (
			<StyledContainer>
				<StyledContent>
					<StyledHeader>
						<div>
							<StyledTitle>Sígueme en Instagram</StyledTitle>
							<StyledDescription>
								Cargando contenido de Instagram...
							</StyledDescription>
						</div>
						<StyledInstagramIcon>
							<svg viewBox='0 0 24 24' fill='currentColor'>
								<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
							</svg>
						</StyledInstagramIcon>
					</StyledHeader>
				</StyledContent>
			</StyledContainer>
		);
	}

	// Si no hay posts para mostrar
	if (reels.length === 0) {
		return (
			<StyledContainer>
				<StyledContent>
					<StyledHeader>
						<div>
							<StyledTitle>Sígueme en Instagram</StyledTitle>
							<StyledDescription>
								{error
									? 'Error cargando contenido de Instagram. Inténtalo más tarde.'
									: 'No hay posts de Instagram disponibles en este momento.'}
							</StyledDescription>
						</div>
						<StyledInstagramIcon>
							<svg viewBox='0 0 24 24' fill='currentColor'>
								<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
							</svg>
						</StyledInstagramIcon>
					</StyledHeader>
				</StyledContent>
			</StyledContainer>
		);
	}

	return (
		<StyledContainer>
			<StyledContent>
				<StyledHeader>
					<div>
						<StyledTitle>Sígueme en Instagram</StyledTitle>
						<StyledDescription>
							Sígueme en Instagram para descubrir propiedades únicas, consejos
							inmobiliarios y las últimas novedades del sector. ¡No te pierdas
							nada!
						</StyledDescription>
					</div>
					<StyledInstagramIcon>
						<svg viewBox='0 0 24 24' fill='currentColor'>
							<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
						</svg>
					</StyledInstagramIcon>
				</StyledHeader>

				<StyledSliderContainer>
					<StyledSliderWrapper currentSlide={currentSlide}>
						{reels.map((reel, index) => (
							<StyledReelItem key={reel.id}>
								<iframe
									src={reel.embedUrl}
									width='100%'
									height='100%'
									frameBorder='0'
									scrolling='no'
									allow='encrypted-media'
									title={reel.title}
								/>
							</StyledReelItem>
						))}
					</StyledSliderWrapper>

					{reels.length > 3 && (
						<StyledNavigationContainer>
							<StyledNavigationButton onClick={prevSlide}>
								←
							</StyledNavigationButton>
							<StyledNavigationButton onClick={nextSlide}>
								→
							</StyledNavigationButton>
						</StyledNavigationContainer>
					)}
				</StyledSliderContainer>
			</StyledContent>
		</StyledContainer>
	);
};

export default InstagramFeed;
