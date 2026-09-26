export default async function handler(req, res) {
  const SUPABASE_URL = 'https://hcpwbyqhknowviciazit.supabase.co';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vercel rewrites se path nikaalo
  let pathSegments = req.query.path || [];
  if (!Array.isArray(pathSegments)) {
    pathSegments = [pathSegments];
  }
  const supabasePath = '/' + pathSegments.join('/');

  // Query string bhi preserve karo (jo path me nahi hai)
  const queryParams = { ...req.query };
  delete queryParams.path;
  const queryString = new URLSearchParams(queryParams).toString();

  const targetUrl = SUPABASE_URL + supabasePath + (queryString ? '?' + queryString : '');

  try {
    const fetchOpts = {
      method: req.method,
      headers: {
        'apikey': req.headers['apikey'] || '',
        'authorization': req.headers['authorization'] || '',
        'content-type': req.headers['content-type'] || 'application/json',
        'prefer': req.headers['prefer'] || '',
        'x-client-info': req.headers['x-client-info'] || '',
      },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOpts.body = typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOpts);
    const data = await response.text();

    res.status(response.status);
    res.setHeader('Content-Type',
      response.headers.get('content-type') || 'application/json');
    res.send(data);
  } catch (error) {
    res.status(500).json({
      error: 'Proxy failed',
      message: String(error),
      cause: error.cause ? String(error.cause) : 'no cause',
      target: targetUrl,
    });
  }
}
