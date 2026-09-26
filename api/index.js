export default async function handler(req, res) {
  const SUPABASE_URL = 'https://hcpwbyqhknowviciazit.supabase.co';

  const urlObj = new URL(req.url, 'http://x');
  const supabasePath = urlObj.pathname.replace(/^\/api/, '') + urlObj.search;
  const targetUrl = SUPABASE_URL + supabasePath;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const fetchOpts = {
      method: req.method,
      headers: {
        'apikey': req.headers['apikey'] || '',
        'authorization': req.headers['authorization'] || '',
        'content-type': req.headers['content-type'] || 'application/json',
        'prefer': req.headers['prefer'] || '',
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
      target: targetUrl,
    });
  }
}
