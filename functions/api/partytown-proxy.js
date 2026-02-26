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
        'www.google-analytics.com',
        'ssl.google-analytics.com',
        'www.google.com'
    ];
    
    try {
        const target = new URL(targetUrl);
        if (!allowedDomains.includes(target.hostname)) {
            return new Response('Forbidden domain', { status: 403 });
        }

        const response = await fetch(targetUrl);
        const body = await response.arrayBuffer();
        
        // Forward essential headers
        const headers = new Headers();
        const contentType = response.headers.get('content-type');
        if (contentType) headers.set('content-type', contentType);
        
        // Cache for 1 hour
        headers.set('Cache-Control', 'public, max-age=3600');

        return new Response(body, {
            status: response.status,
            headers: headers
        });
    } catch (e) {
        return new Response('Invalid target URL', { status: 400 });
    }
}
