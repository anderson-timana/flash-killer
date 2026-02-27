export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
        },
    });
}

export async function onRequestGet(context) {
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
        'google.com'
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

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0'
            }
        });
        
        const body = await response.arrayBuffer();
        
        // Forward essential headers
        const headers = new Headers();
        const contentType = response.headers.get('content-type');
        if (contentType) headers.set('content-type', contentType);
        
        // CORS and Caching
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=3600');

        return new Response(body, {
            status: response.status,
            headers: headers
        });
    } catch (e) {
        return new Response('Invalid target URL: ' + e.message, { status: 400 });
    }
}
