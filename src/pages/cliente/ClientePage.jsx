import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * ClientePage — Maneja los enlaces de escaparate cliente que Inmovilla envía
 * desde su CRM (para compartir propiedades por WhatsApp, email, etc.).
 *
 * Inmovilla construye los enlaces con este formato:
 *   https://erikacasals.com/cliente/?cliente=0113731_XXXX&medio=4
 *
 * Renderiza el iframe del CRM de Inmovilla (ap.apinmo.com) igual que
 * hace el cliente_index.php en la versión PHP.
 */
const ClientePage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const cliente = searchParams.get('cliente') || '';
	const msj = searchParams.get('msj') || '';
	const estadistica = searchParams.get('estadistica') || '';
	const col = searchParams.get('col') || '';

	// Construir el parámetro cliente con opciones adicionales
	let clienteParam = cliente;
	if (msj) clienteParam += '&msg=1';
	if (col) clienteParam += `&col=${col}`;

	// Código inválido
	if (!cliente && !estadistica) {
		return (
			<div style={styles.errorContainer}>
				<h2>Enlace no válido</h2>
				<p>El enlace no contiene un código de cliente válido.</p>
				<button onClick={() => navigate('/')} style={styles.button}>
					Volver al inicio
				</button>
			</div>
		);
	}

	// Modo estadística (propietarios)
	if (estadistica) {
		const iframeUrl = `https://ap.apinmo.com/app/propietarios/index.php?cliente=${estadistica}&x=${Date.now()}`;
		return (
			<div style={styles.fullscreen}>
				<iframe
					src={iframeUrl}
					title='Panel propietario'
					style={styles.iframe}
					frameBorder='0'
					allowFullScreen
					scrolling='auto'
					allow='camera *; microphone *'
					sandbox='allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads'
				/>
			</div>
		);
	}

	// Modo cliente (escaparate — por defecto)
	const iframeUrl = `https://ap.apinmo.com/app/escaparatecliente/index.php?cliente=${clienteParam}&x=${Date.now()}`;

	return (
		<div style={styles.fullscreen}>
			<iframe
				src={iframeUrl}
				title='Escaparate de propiedades'
				style={styles.iframe}
				frameBorder='0'
				allowFullScreen
				scrolling='auto'
				allow='camera *; microphone *'
				sandbox='allow-scripts allow-modals allow-top-navigation allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox allow-downloads'
			/>
		</div>
	);
};

const styles = {
	fullscreen: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		overflow: 'hidden',
		background: '#fff'
	},
	iframe: {
		width: '100%',
		height: '100%',
		border: 'none',
		display: 'block'
	},
	errorContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '60vh',
		gap: '1rem',
		fontFamily: 'sans-serif',
		color: '#333',
		padding: '2rem'
	},
	button: {
		padding: '0.75rem 1.5rem',
		background: '#2c5f8a',
		color: '#fff',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '1rem'
	}
};

export default ClientePage;
