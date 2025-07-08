const axios = require('axios');

async function testOAuth2() {
	const client_id = process.env.IDEALISTA_CLIENT_ID || 'wow';
	const client_secret =
		process.env.IDEALISTA_CLIENT_SECRET || 'saGJZj7FGIi2HO3BVbO8TiwZRZVX2rWU';

	console.log('Testing OAuth2 with credentials:');
	console.log('Client ID:', client_id);
	console.log(
		'Client Secret:',
		client_secret ? `${client_secret.substring(0, 10)}...` : 'MISSING'
	);

	const tokenUrl = 'https://api.idealista.com/oauth/token';

	const tokenData = {
		grant_type: 'client_credentials',
		scope: 'read'
	};

	const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

	try {
		console.log('\nMaking OAuth2 request...');
		const response = await axios.post(tokenUrl, tokenData, {
			headers: {
				Authorization: `Basic ${auth}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		console.log('✅ OAuth2 Success!');
		console.log('Token response:', response.data);
	} catch (error) {
		console.log('❌ OAuth2 Error!');
		console.log('Status:', error.response?.status);
		console.log('Error data:', error.response?.data);
		console.log('Full error:', error.message);
	}
}

testOAuth2();
