export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return new Response('Missing url parameter', { status: 400 });
    }

    // Security check: Only allow specific domains to be proxied
    const allowedDomains = [
        'www.googletagmanager.com',
        'googletagmanager.com',
        'www.google-analytics.com',
        'google-analytics.com',
        'ssl.google-analytics.com',
        'www.google.com',
        'google.com',
        'analytics.google.com'
    ];
    
    try {
        const target = new URL(targetUrl);
        const hostname = target.hostname;
        
        const isAllowed = allowedDomains.some(domain => 
            hostname === domain || hostname.endsWith('.' + domain)
        );

        if (!isAllowed) {
            return new Response('Forbidden domain: ' + hostname, { status: 403 });
        }

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        // Prepare request to target
        const proxyRequest = new Request(targetUrl, {
            method: request.method,
            headers: request.headers,
            body: request.method === 'POST' ? await request.arrayBuffer() : null,
            redirect: 'follow'
        });

        // Fetch from Google
        const response = await fetch(proxyRequest);
        
        // Construct clean response
        const body = await response.arrayBuffer();
        const headers = new Headers(response.headers);
        
        // Ensure CORS is set correctly for Partytown
        headers.set('Access-Control-Allow-Origin', '*');
        
        // Optimization: Browser caching for static scripts
        if (targetUrl.includes('.js')) {
            headers.set('Cache-Control', 'public, max-age=3600');
        }

        return new Response(body, {
            status: response.status,
            headers: headers
        });
    } catch (e) {
        console.error('Proxy Error:', e.message);
        return new Response('Proxy error: ' + e.message, { status: 500 });
    }
}
