export default async function handler(req, res) {
  // Permitir CORS desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path, token } = req.query;
  if (!path || !token) {
    return res.status(400).json({ error: 'Faltan parametros: path y token' });
  }

  try {
    const url = `https://api.football-data.org/v4/${path}`;
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': token,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error del proxy: ' + error.message });
  }
}
