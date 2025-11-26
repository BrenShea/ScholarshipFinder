export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Extract the university ID and path from the URL
    const { university, ...params } = req.query;
    const path = params['0'] || '';

    // Map university IDs to their base URLs
    const universityMap = {
        'ucf': 'https://ucf.academicworks.com',
        'depaul': 'https://depaul.academicworks.com',
        'fiu': 'https://fiu.academicworks.com',
        'clc': 'https://clcillinois.academicworks.com',
        'slu': 'https://slu.academicworks.com',
        'uccs': 'https://uccs.academicworks.com',
        'uwm': 'https://uwm.academicworks.com',
        'csuchico': 'https://csuchico.academicworks.com',
        'utsa': 'https://utsa.academicworks.com',
        'umich': 'https://umich.academicworks.com',
        'utah': 'https://utah.academicworks.com',
        'usu': 'https://usu.academicworks.com',
        'humboldt': 'https://humboldt.academicworks.com',
        'csusb': 'https://csusb.academicworks.com',
        'csulb': 'https://csulb.academicworks.com',
        'csun': 'https://csun.academicworks.com',
        'csuci': 'https://csuci.academicworks.com',
        'cpp': 'https://cpp.academicworks.com',
        'fullerton': 'https://fullerton.academicworks.com',
        'csus': 'https://csus.academicworks.com',
        'towson': 'https://towson.academicworks.com',
        'umass': 'https://umass.academicworks.com',
        'sfsu': 'https://sfsu.academicworks.com',
        'buffalo': 'https://buffalo.academicworks.com',
        'uky': 'https://uky.academicworks.com',
        'bgsu': 'https://bgsu.academicworks.com',
        'csuohio': 'https://csuohio.academicworks.com',
        'asu': 'https://asu.academicworks.com',
        'uoregon': 'https://uoregon.academicworks.com',
        'osu': 'https://osu.academicworks.com',
        'psu': 'https://psu.academicworks.com',
        'rutgers': 'https://rutgers.academicworks.com',
        'temple': 'https://temple.academicworks.com',
        'uconn': 'https://uconn.academicworks.com',
        'umd': 'https://umd.academicworks.com',
        'vt': 'https://vt.academicworks.com',
        'ncsu': 'https://ncsu.academicworks.com',
        'clemson': 'https://clemson.academicworks.com',
        'uga': 'https://uga.academicworks.com',
        'ufl': 'https://ufl.academicworks.com',
        'usf': 'https://usf.academicworks.com',
        'fsu': 'https://fsu.academicworks.com',
        'ua': 'https://ua.academicworks.com',
        'auburn': 'https://auburn.academicworks.com',
        'lsu': 'https://lsu.academicworks.com',
        'utexas': 'https://utexas.academicworks.com',
        'tamu': 'https://tamu.academicworks.com',
        'uh': 'https://uh.academicworks.com',
        'ou': 'https://ou.academicworks.com',
        'ku': 'https://ku.academicworks.com',
        'mizzou': 'https://mizzou.academicworks.com',
        'iowa': 'https://iowa.academicworks.com',
        'isu': 'https://isu.academicworks.com',
        'wisc': 'https://wisc.academicworks.com',
        'umn': 'https://umn.academicworks.com',
        'msu': 'https://msu.academicworks.com',
        'purdue': 'https://purdue.academicworks.com',
        'indiana': 'https://indiana.academicworks.com',
        'northwestern': 'https://northwestern.academicworks.com',
        'uic': 'https://uic.academicworks.com'
    };

    const baseUrl = universityMap[university];

    if (!baseUrl) {
        return res.status(404).json({ error: 'University not found' });
    }

    try {
        // Build the target URL with query parameters
        // Filter out Vercel's dynamic route parameters
        const queryParams = new URLSearchParams();
        Object.keys(req.query).forEach(key => {
            if (key !== 'university' && key !== 'path' && key !== '0') {
                queryParams.append(key, req.query[key]);
            }
        });

        const queryString = queryParams.toString();
        const targetUrl = `${baseUrl}/${path}${queryString ? '?' + queryString : ''}`;

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        const data = await response.text();

        // Strip upstream CORS headers to avoid conflicts
        res.removeHeader('Access-Control-Allow-Origin');

        res.setHeader('Content-Type', 'text/html');
        // Ensure we send 200 even if upstream sent 302/403 (unless it's a real error)
        // Actually, if it's 403/302, the data might be the block page. 
        // But sending 200 allows the client to at least try to parse it (and fail gracefully) instead of CORS error.
        res.status(200).send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
