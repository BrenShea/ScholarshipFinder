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
        const queryString = new URLSearchParams(req.query).toString();
        const targetUrl = `${baseUrl}/${path}${queryString ? '?' + queryString : ''}`;

        const response = await fetch(targetUrl);
        const data = await response.text();

        res.setHeader('Content-Type', 'text/html');
        res.status(response.status).send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
