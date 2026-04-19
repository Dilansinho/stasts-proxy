export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token');

  // Responder a las peticiones OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Obtener parámetros de la URL
  const { path, token } = req.query;

  // Validar que los parámetros existan
  if (!path || !token) {
    return res.status(400).json({ 
      error: 'Faltan parámetros requeridos: path y token' 
    });
  }

  try {
    // Construir la URL completa de football-data.org
    const url = 'https://api.football-data.org/v4/' + path;
    
    console.log('🔵 Proxy request:', url.substring(0, 80) + '...');

    // Realizar la petición a la API real
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token
      }
    });

    // Obtener la respuesta como JSON
    const data = await response.json();

    // Log del resultado
    if (data.matches) {
      console.log('✅ Partidos obtenidos:', data.matches.length);
    } else if (data.competitions) {
      console.log('✅ Competiciones obtenidas:', data.competitions.length);
    } else {
      console.log('⚠️ Respuesta sin datos esperados');
    }

    // Devolver la respuesta al cliente
    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Error del proxy:', error.message);
    
    return res.status(500).json({ 
      error: 'Error del proxy: ' + error.message 
    });
  }
}
