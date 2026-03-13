import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f5f5f5;
	font-family: sans-serif;
`;

const Card = styled.div`
	background: #fff;
	border-radius: 16px;
	padding: 48px 40px;
	width: 100%;
	max-width: 420px;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
`;

const Logo = styled.div`
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: #999;
	margin-bottom: 32px;
`;

const Title = styled.h1`
	font-size: 22px;
	font-weight: 700;
	color: #1a1a1a;
	margin: 0 0 8px;
`;

const Subtitle = styled.p`
	font-size: 14px;
	color: #888;
	margin: 0 0 32px;
`;

const Input = styled.input`
	width: 100%;
	padding: 14px 16px;
	font-size: 16px;
	border: 1.5px solid #e0e0e0;
	border-radius: 10px;
	outline: none;
	letter-spacing: 6px;
	text-align: center;
	box-sizing: border-box;
	transition: border-color 0.2s;

	&:focus {
		border-color: #1a1a1a;
	}
`;

const Button = styled.button`
	width: 100%;
	padding: 14px;
	margin-top: 16px;
	font-size: 15px;
	font-weight: 600;
	color: #fff;
	background: ${({ disabled }) => (disabled ? '#ccc' : '#1a1a1a')};
	border: none;
	border-radius: 10px;
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	transition: background 0.2s;

	&:hover:not(:disabled) {
		background: #333;
	}
`;

const ErrorMsg = styled.p`
	font-size: 13px;
	color: #e53935;
	margin: 12px 0 0;
	text-align: center;
`;

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 12px;
	margin-bottom: 32px;
`;

const StatBox = styled.div`
	background: #f8f8f8;
	border-radius: 10px;
	padding: 16px 12px;
	text-align: center;
`;

const StatNumber = styled.div`
	font-size: 28px;
	font-weight: 700;
	color: #1a1a1a;
`;

const StatLabel = styled.div`
	font-size: 11px;
	color: #999;
	text-transform: uppercase;
	letter-spacing: 1px;
	margin-top: 4px;
`;

const LastUpdate = styled.p`
	font-size: 12px;
	color: #bbb;
	text-align: center;
	margin: 0 0 28px;
`;

const StatusMsg = styled.div`
	margin-top: 16px;
	padding: 12px 16px;
	border-radius: 10px;
	font-size: 14px;
	text-align: center;
	background: ${({ type }) => (type === 'success' ? '#e8f5e9' : '#fff3e0')};
	color: ${({ type }) => (type === 'success' ? '#2e7d32' : '#e65100')};
`;

const CooldownMsg = styled.p`
	font-size: 12px;
	color: #aaa;
	text-align: center;
	margin: 10px 0 0;
`;

// ─────────────────────────────────────────────────────────────────────────────

const COOLDOWN_MS = 5 * 60 * 1000;
const COOLDOWN_KEY = 'admin_update_cooldown';

export default function AdminPage() {
	const [pin, setPin] = useState('');
	const [authenticated, setAuthenticated] = useState(false);
	const [error, setError] = useState('');
	const [meta, setMeta] = useState(null);
	const [updating, setUpdating] = useState(false);
	const [status, setStatus] = useState(null); // { type: 'success'|'info', text }
	const [cooldownLeft, setCooldownLeft] = useState(() => {
		const saved = localStorage.getItem(COOLDOWN_KEY);
		if (!saved) return 0;
		const remaining = Math.ceil((Number(saved) - Date.now()) / 1000);
		return remaining > 0 ? remaining : 0;
	});

	// Cuenta regresiva del cooldown
	useEffect(() => {
		if (cooldownLeft <= 0) return;
		const interval = setInterval(() => {
			setCooldownLeft(prev => {
				if (prev <= 1) { clearInterval(interval); return 0; }
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [cooldownLeft]);

	// Cargar metadata del JSON al autenticarse
	useEffect(() => {
		if (!authenticated) return;
		fetch('/inmovilla-properties-all.json')
			.then(r => r.json())
			.then(data => {
				if (!Array.isArray(data)) setMeta(data);
			})
			.catch(() => {});
	}, [authenticated]);

	function handlePinSubmit(e) {
		e.preventDefault();
		// La verificación real ocurre en el servidor al pulsar "Actualizar".
		// Aquí solo marcamos como autenticado para mostrar el panel.
		if (pin.length >= 4) {
			setAuthenticated(true);
			setError('');
		} else {
			setError('El PIN debe tener al menos 4 dígitos.');
		}
	}

	async function handleUpdate() {
		setUpdating(true);
		setStatus(null);
		try {
			const res = await fetch('/api/trigger-update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pin })
			});
			const data = await res.json();
			if (!res.ok || !data.ok) {
				setError(data.error || 'Error al actualizar');
				if (data.error === 'PIN incorrecto') setAuthenticated(false);
			} else {
				const cooldownUntil = Date.now() + COOLDOWN_MS;
				localStorage.setItem(COOLDOWN_KEY, String(cooldownUntil));
				setCooldownLeft(COOLDOWN_MS / 1000);
				setStatus({
					type: 'success',
					text: '¡Actualización iniciada! El sitio se redesplegará en ~2 minutos con las propiedades más recientes.'
				});
			}
		} catch {
			setStatus({ type: 'info', text: 'No se pudo contactar al servidor. Inténtalo de nuevo.' });
		} finally {
			setUpdating(false);
		}
	}

	function formatDate(iso) {
		if (!iso) return '—';
		return new Date(iso).toLocaleString('es-ES', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	return (
		<Wrapper>
			<Card>
				<Logo>erikacasals.com</Logo>

				{!authenticated ? (
					<>
						<Title>Panel de administración</Title>
						<Subtitle>Introduce el PIN para acceder.</Subtitle>
						<form onSubmit={handlePinSubmit}>
							<Input
								type='password'
								inputMode='numeric'
								maxLength={8}
								placeholder='· · · ·'
								value={pin}
								onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
								autoFocus
							/>
							{error && <ErrorMsg>{error}</ErrorMsg>}
							<Button type='submit' disabled={pin.length < 4}>
								Entrar
							</Button>
						</form>
					</>
				) : (
					<>
						<Title>Propiedades</Title>

						{meta ? (
							<>
								<LastUpdate>Última actualización: {formatDate(meta.generatedAt)}</LastUpdate>
								<StatsGrid>
									<StatBox>
										<StatNumber>{meta.total ?? '—'}</StatNumber>
										<StatLabel>Total</StatLabel>
									</StatBox>
									<StatBox>
										<StatNumber>{meta.sale ?? '—'}</StatNumber>
										<StatLabel>Venta</StatLabel>
									</StatBox>
									<StatBox>
										<StatNumber>{meta.rent ?? '—'}</StatNumber>
										<StatLabel>Alquiler</StatLabel>
									</StatBox>
								</StatsGrid>
							</>
						) : (
							<LastUpdate>Cargando datos...</LastUpdate>
						)}

						<Button onClick={handleUpdate} disabled={updating || cooldownLeft > 0}>
							{updating
								? 'Iniciando actualización...'
								: cooldownLeft > 0
									? `Disponible en ${Math.floor(cooldownLeft / 60)}:${String(cooldownLeft % 60).padStart(2, '0')}`
									: 'Actualizar propiedades'}
						</Button>

						{cooldownLeft > 0 && (
							<CooldownMsg>La actualización anterior ya está en proceso.</CooldownMsg>
						)}
						{status && <StatusMsg type={status.type}>{status.text}</StatusMsg>}
						{error && <ErrorMsg>{error}</ErrorMsg>}
					</>
				)}
			</Card>
		</Wrapper>
	);
}
