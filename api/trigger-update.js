/**
 * POST /api/trigger-update
 * Verifica el PIN y dispara un nuevo deploy en Vercel vía deploy hook.
 *
 * Variables de entorno requeridas (Vercel > Settings > Environment Variables):
 *   ADMIN_PIN            — PIN numérico que usan Erika y Lorena para autorizar el trigger
 *   VERCEL_DEPLOY_HOOK   — URL del deploy hook (Vercel > Settings > Git > Deploy Hooks)
 */
export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ ok: false, error: 'Método no permitido' });
	}

	const { pin } = req.body || {};

	if (!pin || pin !== process.env.ADMIN_PIN) {
		return res.status(401).json({ ok: false, error: 'PIN incorrecto' });
	}

	const hookUrl = process.env.VERCEL_DEPLOY_HOOK;
	if (!hookUrl) {
		return res.status(500).json({ ok: false, error: 'Deploy hook no configurado' });
	}

	const response = await fetch(hookUrl, { method: 'POST' });
	if (!response.ok) {
		return res.status(500).json({ ok: false, error: 'Error al disparar el deploy' });
	}

	return res.status(200).json({ ok: true });
}
