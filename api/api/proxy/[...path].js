export default async function handler(req, res) {
  const SUPABASE_URL = 'https://hcpwbyqhknowviciazit.supabase.co';
  
  const path = req.url.replace(/^\/api\/proxy/, '');
  const targetUrl = SUPABASE_URL + path;
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'apikey': req.headers['apikey'] || '',
        'authorization': req.headers['authorization'] || '',
        'content-type': req.headers['content-type'] || 'application/json',
        'prefer': req.headers['prefer'] || '',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Proxy failed',
      message: String(error),
      target: targetUrl 
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
