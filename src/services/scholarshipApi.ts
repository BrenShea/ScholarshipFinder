import type { Scholarship } from '../types';

const SOURCES = [
    { id: 'ucf', name: 'UCF', url: '/api/ucf/opportunities/external', baseUrl: 'https://ucf.academicworks.com' },
    { id: 'depaul', name: 'DePaul', url: '/api/depaul/opportunities/external', baseUrl: 'https://depaul.academicworks.com' },
    { id: 'fiu', name: 'FIU', url: '/api/fiu/opportunities/external', baseUrl: 'https://fiu.academicworks.com' },
    { id: 'clc', name: 'CLC', url: '/api/clc/opportunities/external', baseUrl: 'https://clcillinois.academicworks.com' },
    { id: 'slu', name: 'SLU', url: '/api/slu/opportunities/external', baseUrl: 'https://slu.academicworks.com' },
    { id: 'uccs', name: 'UCCS', url: '/api/uccs/opportunities/external', baseUrl: 'https://uccs.academicworks.com' },
    { id: 'uwm', name: 'UWM', url: '/api/uwm/opportunities/external', baseUrl: 'https://uwm.academicworks.com' },
    { id: 'csuchico', name: 'CSU Chico', url: '/api/csuchico/opportunities/external', baseUrl: 'https://csuchico.academicworks.com' },
    { id: 'utsa', name: 'UTSA', url: '/api/utsa/opportunities/external', baseUrl: 'https://utsa.academicworks.com' },
    { id: 'umich', name: 'UMich', url: '/api/umich/opportunities/external', baseUrl: 'https://umich.academicworks.com' },
    { id: 'utah', name: 'Utah', url: '/api/utah/opportunities/external', baseUrl: 'https://utah.academicworks.com' },
    { id: 'usu', name: 'USU', url: '/api/usu/opportunities/external', baseUrl: 'https://usu.academicworks.com' },
    { id: 'humboldt', name: 'Cal Poly Humboldt', url: '/api/humboldt/opportunities/external', baseUrl: 'https://humboldt.academicworks.com' },
    { id: 'csusb', name: 'CSUSB', url: '/api/csusb/opportunities/external', baseUrl: 'https://csusb.academicworks.com' },
    { id: 'csulb', name: 'CSULB', url: '/api/csulb/opportunities/external', baseUrl: 'https://csulb.academicworks.com' },
    { id: 'csun', name: 'CSUN', url: '/api/csun/opportunities/external', baseUrl: 'https://csun.academicworks.com' },
    { id: 'csuci', name: 'CSUCI', url: '/api/csuci/opportunities/external', baseUrl: 'https://csuci.academicworks.com' },
    { id: 'cpp', name: 'Cal Poly Pomona', url: '/api/cpp/opportunities/external', baseUrl: 'https://cpp.academicworks.com' },
    { id: 'fullerton', name: 'CSU Fullerton', url: '/api/fullerton/opportunities/external', baseUrl: 'https://fullerton.academicworks.com' },
    { id: 'csus', name: 'Sac State', url: '/api/csus/opportunities/external', baseUrl: 'https://csus.academicworks.com' },
    { id: 'towson', name: 'Towson', url: '/api/towson/opportunities/external', baseUrl: 'https://towson.academicworks.com' },
    { id: 'umass', name: 'UMass Amherst', url: '/api/umass/opportunities/external', baseUrl: 'https://umass.academicworks.com' },
    { id: 'sfsu', name: 'SF State', url: '/api/sfsu/opportunities/external', baseUrl: 'https://sfsu.academicworks.com' },
    { id: 'buffalo', name: 'Buffalo', url: '/api/buffalo/opportunities/external', baseUrl: 'https://buffalo.academicworks.com' },
    { id: 'uky', name: 'Kentucky', url: '/api/uky/opportunities/external', baseUrl: 'https://uky.academicworks.com' },
    { id: 'bgsu', name: 'BGSU', url: '/api/bgsu/opportunities/external', baseUrl: 'https://bgsu.academicworks.com' },
    { id: 'csuohio', name: 'Cleveland State', url: '/api/csuohio/opportunities/external', baseUrl: 'https://csuohio.academicworks.com' },
    { id: 'asu', name: 'ASU', url: '/api/asu/opportunities/external', baseUrl: 'https://asu.academicworks.com' },
    { id: 'uoregon', name: 'Oregon', url: '/api/uoregon/opportunities/external', baseUrl: 'https://uoregon.academicworks.com' },
    { id: 'osu', name: 'Ohio State', url: '/api/osu/opportunities/external', baseUrl: 'https://osu.academicworks.com' },
    { id: 'psu', name: 'Penn State', url: '/api/psu/opportunities/external', baseUrl: 'https://psu.academicworks.com' },
    { id: 'rutgers', name: 'Rutgers', url: '/api/rutgers/opportunities/external', baseUrl: 'https://rutgers.academicworks.com' },
    { id: 'temple', name: 'Temple', url: '/api/temple/opportunities/external', baseUrl: 'https://temple.academicworks.com' },
    { id: 'uconn', name: 'UConn', url: '/api/uconn/opportunities/external', baseUrl: 'https://uconn.academicworks.com' },
    { id: 'umd', name: 'Maryland', url: '/api/umd/opportunities/external', baseUrl: 'https://umd.academicworks.com' },
    { id: 'vt', name: 'Virginia Tech', url: '/api/vt/opportunities/external', baseUrl: 'https://vt.academicworks.com' },
    { id: 'ncsu', name: 'NC State', url: '/api/ncsu/opportunities/external', baseUrl: 'https://ncsu.academicworks.com' },
    { id: 'clemson', name: 'Clemson', url: '/api/clemson/opportunities/external', baseUrl: 'https://clemson.academicworks.com' },
    { id: 'uga', name: 'Georgia', url: '/api/uga/opportunities/external', baseUrl: 'https://uga.academicworks.com' },
    { id: 'ufl', name: 'Florida', url: '/api/ufl/opportunities/external', baseUrl: 'https://ufl.academicworks.com' },
    { id: 'usf', name: 'USF', url: '/api/usf/opportunities/external', baseUrl: 'https://usf.academicworks.com' },
    { id: 'fsu', name: 'FSU', url: '/api/fsu/opportunities/external', baseUrl: 'https://fsu.academicworks.com' },
    { id: 'ua', name: 'Alabama', url: '/api/ua/opportunities/external', baseUrl: 'https://ua.academicworks.com' },
    { id: 'auburn', name: 'Auburn', url: '/api/auburn/opportunities/external', baseUrl: 'https://auburn.academicworks.com' },
    { id: 'lsu', name: 'LSU', url: '/api/lsu/opportunities/external', baseUrl: 'https://lsu.academicworks.com' },
    { id: 'utexas', name: 'UT Austin', url: '/api/utexas/opportunities/external', baseUrl: 'https://utexas.academicworks.com' },
    { id: 'tamu', name: 'Texas A&M', url: '/api/tamu/opportunities/external', baseUrl: 'https://tamu.academicworks.com' },
    { id: 'uh', name: 'Houston', url: '/api/uh/opportunities/external', baseUrl: 'https://uh.academicworks.com' },
    { id: 'ou', name: 'Oklahoma', url: '/api/ou/opportunities/external', baseUrl: 'https://ou.academicworks.com' },
    { id: 'ku', name: 'Kansas', url: '/api/ku/opportunities/external', baseUrl: 'https://ku.academicworks.com' },
    { id: 'mizzou', name: 'Missouri', url: '/api/mizzou/opportunities/external', baseUrl: 'https://mizzou.academicworks.com' },
    { id: 'iowa', name: 'Iowa', url: '/api/iowa/opportunities/external', baseUrl: 'https://iowa.academicworks.com' },
    { id: 'isu', name: 'Iowa State', url: '/api/isu/opportunities/external', baseUrl: 'https://isu.academicworks.com' },
    { id: 'wisc', name: 'Wisconsin', url: '/api/wisc/opportunities/external', baseUrl: 'https://wisc.academicworks.com' },
    { id: 'umn', name: 'Minnesota', url: '/api/umn/opportunities/external', baseUrl: 'https://umn.academicworks.com' },
    { id: 'msu', name: 'Michigan State', url: '/api/msu/opportunities/external', baseUrl: 'https://msu.academicworks.com' },
    { id: 'purdue', name: 'Purdue', url: '/api/purdue/opportunities/external', baseUrl: 'https://purdue.academicworks.com' },
    { id: 'indiana', name: 'Indiana', url: '/api/indiana/opportunities/external', baseUrl: 'https://indiana.academicworks.com' },
    { id: 'northwestern', name: 'Northwestern', url: '/api/northwestern/opportunities/external', baseUrl: 'https://northwestern.academicworks.com' },
    { id: 'uic', name: 'UIC', url: '/api/uic/opportunities/external', baseUrl: 'https://uic.academicworks.com' },
];

const categorizeScholarship = (name: string, description: string): string[] => {
    const text = (name + ' ' + description).toLowerCase();
    const categories = new Set<string>();

    if (text.includes('technology') || text.includes('computer') || text.includes('engineering') || text.includes('stem') || text.includes('science') || text.includes('math') || text.includes('cyber') || text.includes('data')) {
        categories.add('Technology/STEM');
    }
    if (text.includes('medical') || text.includes('health') || text.includes('nursing') || text.includes('doctor') || text.includes('medicine') || text.includes('biology') || text.includes('dental') || text.includes('pharmacy')) {
        categories.add('Medical/Health');
    }
    if (text.includes('law') || text.includes('legal') || text.includes('justice') || text.includes('attorney') || text.includes('political') || text.includes('policy')) {
        categories.add('Law/Policy');
    }
    if (text.includes('business') || text.includes('finance') || text.includes('accounting') || text.includes('marketing') || text.includes('management') || text.includes('entrepreneur')) {
        categories.add('Business');
    }
    if (text.includes('art') || text.includes('design') || text.includes('music') || text.includes('theater') || text.includes('film') || text.includes('creative') || text.includes('media')) {
        categories.add('Arts/Creative');
    }
    if (text.includes('education') || text.includes('teaching') || text.includes('teacher') || text.includes('child')) {
        categories.add('Education');
    }
    if (text.includes('sport') || text.includes('athlete') || text.includes('athletic')) {
        categories.add('Athletics');
    }
    if (text.includes('woman') || text.includes('women') || text.includes('female')) {
        categories.add('Women');
    }
    if (text.includes('minority') || text.includes('diversity') || text.includes('hispanic') || text.includes('latino') || text.includes('black') || text.includes('african') || text.includes('asian') || text.includes('native')) {
        categories.add('Diversity');
    }

    if (categories.size === 0) {
        categories.add('General');
    }

    return Array.from(categories);
};

const fetchScholarshipsFromSource = async (source: typeof SOURCES[0]): Promise<Scholarship[]> => {
    let allScholarships: Scholarship[] = [];
    let page = 1;
    const MAX_PAGES = 8; // Balanced: enough scholarships without excessive bandwidth

    try {
        while (page <= MAX_PAGES) {
            // Use our Vercel API proxy
            const response = await fetch(`/api/${source.id}/opportunities/external?page=${page}`);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            // Relaxed selector to catch more tables, filtered by content later
            const rows = Array.from(doc.querySelectorAll('tbody tr'));

            if (rows.length === 0) {
                break;
            }

            const pageScholarships = rows.map((row, index) => {
                // Extract Amount
                const amountCell = row.querySelector('td.strong.h4');
                const amountText = amountCell?.textContent?.trim() || '$0';
                const cleanAmountText = amountText.replace(/[$,]/g, '');
                const amount = Math.floor(parseFloat(cleanAmountText)) || 0;

                // Extract Name and Link
                const nameLink = row.querySelector('th[scope="row"] a');
                let name = nameLink?.textContent?.trim() || '';
                const relativeLink = nameLink?.getAttribute('href') || '';
                const link = relativeLink ? `${source.baseUrl}${relativeLink}` : '';

                // Fallback for name if link exists but name is empty
                if (!name && link) {
                    name = 'Scholarship Opportunity';
                }

                // If we still don't have a name, or it's "Unknown Scholarship", or no specific link, skip this one
                if (!name || name === 'Unknown Scholarship' || !link || link === source.baseUrl) {
                    return { isValid: false } as any;
                }

                // Extract Description
                const descriptionDiv = row.querySelector('th[scope="row"] .mq-no-bp-only');
                const description = descriptionDiv?.textContent?.trim() || 'No description available.';

                // Extract Deadline
                const dateSpan = row.querySelector('td.center span.mq-no-bp-only');
                const deadlineText = dateSpan?.textContent?.trim() || '';

                // Validate Date
                let deadline = deadlineText;
                // let isValidDate = false; // Unused
                if (deadlineText && deadlineText.toLowerCase() !== 'see website') {
                    const date = new Date(deadlineText);
                    if (!isNaN(date.getTime())) {
                        // isValidDate = true;
                    }
                }

                // Extract Requirements
                // Clean up description first
                const cleanDesc = description
                    .replace(/\r\n|\n|\r/g, ' ') // Remove newlines
                    .replace(/\s+/g, ' ') // Normalize spaces
                    .replace(/(\d)\. (\d)/g, '$1.$2'); // Fix broken decimals like 3. 0 GPA

                let requirements = cleanDesc
                    .split(/(?<=[.?!;])\s+(?=[A-Z])/) // Split by sentence endings followed by a capital letter
                    .map(s => s.trim())
                    .filter(s => {
                        const lower = s.toLowerCase();
                        return s.length > 15 && // Increased min length
                            s.length < 200 && // Avoid massive paragraphs
                            !lower.includes('click here') &&
                            !lower.includes('apply button') &&
                            (
                                lower.includes('must') ||
                                lower.includes('eligible') ||
                                lower.includes('gpa') ||
                                lower.includes('student') ||
                                lower.includes('major') ||
                                lower.includes('enrolled') ||
                                lower.includes('year') ||
                                lower.includes('preference') ||
                                lower.includes('criteria')
                            );
                    })
                    .slice(0, 5);

                if (requirements.length === 0) {
                    // Fallback: Try to find a list in the raw HTML if we could access it, 
                    // but since we only have text, let's try a looser split if the strict one failed
                    requirements = cleanDesc
                        .split(/[.;]/)
                        .map(s => s.trim())
                        .filter(s => s.length > 20 && s.toLowerCase().includes('must'))
                        .slice(0, 3);
                }

                if (requirements.length === 0) {
                    requirements = ['Please review the full eligibility requirements on the website.'];
                }

                const categories = categorizeScholarship(name, description);

                return {
                    id: `${source.id}-p${page}-${index}`,
                    name: name,
                    provider: `${source.name} External Opportunities`,
                    amount: amount, // Keep 0 if not found, UI can handle it
                    deadline: deadline || 'See Website',
                    description: description,
                    requirements: requirements,
                    region: 'National',
                    url: link,
                    isValid: true, // Relaxed filtering: accept all parsed items
                    categories: categories
                };
            }); // Removed .filter(s => s.isValid)

            // Remove the temporary isValid flag before adding to list
            const validScholarships = pageScholarships.map(({ isValid, ...s }) => s as Scholarship);

            allScholarships = [...allScholarships, ...validScholarships];

            // If we found nothing on this page, stop
            if (rows.length === 0) break;

            page++;
        }
    } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
    }

    return allScholarships;
};

export const searchScholarships = async (_region: string, onProgress?: (count: number) => void): Promise<Scholarship[]> => {
    // Check cache first
    const CACHE_KEY = 'scholarship_cache_v8'; // Bumped version
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours (increased from 1 hour)

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('Returning cached scholarships');
            return data;
        }
    }

    // Batch requests to prevent overwhelming the browser/network
    const BATCH_SIZE = 5;
    const allResults: Scholarship[] = [];

    for (let i = 0; i < SOURCES.length; i += BATCH_SIZE) {
        const batch = SOURCES.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.all(
            batch.map(source => fetchScholarshipsFromSource(source)
                .catch(err => {
                    return [];
                })
            )
        );

        batchResults.forEach(results => allResults.push(...results));

        // Notify progress
        if (onProgress) {
            onProgress(allResults.length);
        }
    }

    // Deduplicate by ID to ensure unique keys
    const uniqueScholarships = Array.from(new Map(allResults.map(s => [s.id, s])).values());

    // Return all results (User requested to remove region lock)
    // We shuffle them slightly so it's not just blocks of universities
    const finalResults = uniqueScholarships.sort(() => Math.random() - 0.5);

    // Save to cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: finalResults
    }));

    return finalResults;
};
