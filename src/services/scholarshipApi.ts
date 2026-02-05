import { db } from './firebaseConfig';
import { collection, getDocs, query, limit, startAfter, orderBy, doc, writeBatch, getDoc, getCountFromServer, QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';
import type { Scholarship } from '../types';

const SOURCES = [
    // Original sources
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
    // NEW SOURCES - Adding 15+ more universities
    { id: 'berkeley', name: 'UC Berkeley', url: '/api/berkeley/opportunities/external', baseUrl: 'https://berkeley.academicworks.com' },
    { id: 'ucla', name: 'UCLA', url: '/api/ucla/opportunities/external', baseUrl: 'https://ucla.academicworks.com' },
    { id: 'ucsd', name: 'UC San Diego', url: '/api/ucsd/opportunities/external', baseUrl: 'https://ucsd.academicworks.com' },
    { id: 'ucdavis', name: 'UC Davis', url: '/api/ucdavis/opportunities/external', baseUrl: 'https://ucdavis.academicworks.com' },
    { id: 'uci', name: 'UC Irvine', url: '/api/uci/opportunities/external', baseUrl: 'https://uci.academicworks.com' },
    { id: 'uw', name: 'UW', url: '/api/uw/opportunities/external', baseUrl: 'https://uw.academicworks.com' },
    { id: 'colorado', name: 'CU Boulder', url: '/api/colorado/opportunities/external', baseUrl: 'https://colorado.academicworks.com' },
    { id: 'bu', name: 'Boston University', url: '/api/bu/opportunities/external', baseUrl: 'https://bu.academicworks.com' },
    { id: 'nyu', name: 'NYU', url: '/api/nyu/opportunities/external', baseUrl: 'https://nyu.academicworks.com' },
    { id: 'syracuse', name: 'Syracuse', url: '/api/syracuse/opportunities/external', baseUrl: 'https://syracuse.academicworks.com' },
    { id: 'pitt', name: 'Pittsburgh', url: '/api/pitt/opportunities/external', baseUrl: 'https://pitt.academicworks.com' },
    { id: 'sc', name: 'South Carolina', url: '/api/sc/opportunities/external', baseUrl: 'https://sc.academicworks.com' },
    { id: 'utk', name: 'Tennessee', url: '/api/utk/opportunities/external', baseUrl: 'https://utk.academicworks.com' },
    { id: 'uark', name: 'Arkansas', url: '/api/uark/opportunities/external', baseUrl: 'https://uark.academicworks.com' },
    { id: 'unl', name: 'Nebraska', url: '/api/unl/opportunities/external', baseUrl: 'https://unl.academicworks.com' },
    { id: 'wvu', name: 'West Virginia', url: '/api/wvu/opportunities/external', baseUrl: 'https://wvu.academicworks.com' },
    { id: 'uva', name: 'Virginia', url: '/api/uva/opportunities/external', baseUrl: 'https://uva.academicworks.com' },
    { id: 'unc', name: 'UNC Chapel Hill', url: '/api/unc/opportunities/external', baseUrl: 'https://unc.academicworks.com' },
    { id: 'duke', name: 'Duke', url: '/api/duke/opportunities/external', baseUrl: 'https://duke.academicworks.com' },
    { id: 'gatech', name: 'Georgia Tech', url: '/api/gatech/opportunities/external', baseUrl: 'https://gatech.academicworks.com' },
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

const fetchScholarshipsFromSource = async (source: typeof SOURCES[0], maxPages: number): Promise<Scholarship[]> => {
    let allScholarships: Scholarship[] = [];
    let page = 1;

    try {
        while (page <= maxPages) {
            // Use our Vercel API proxy
            const response = await fetch(`/api/${source.id}/opportunities/external?page=${page}`);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = Array.from(doc.querySelectorAll('tbody tr'));

            if (rows.length === 0) {
                break;
            }

            const pageScholarships = rows.map((row) => {
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

                if (!name && link) {
                    name = 'Scholarship Opportunity';
                }

                if (!name || name === 'Unknown Scholarship' || !link || link === source.baseUrl) {
                    return { isValid: false } as any;
                }

                // Extract Description
                const descriptionDiv = row.querySelector('th[scope="row"] .mq-no-bp-only');
                const description = descriptionDiv?.textContent?.trim() || 'No description available.';

                // Extract Deadline
                const dateSpan = row.querySelector('td.center span.mq-no-bp-only');
                const deadlineText = dateSpan?.textContent?.trim() || '';

                let deadline = deadlineText;
                let isValidDate = false;

                if (deadlineText) {
                    const date = new Date(deadlineText);
                    if (!isNaN(date.getTime())) {
                        isValidDate = true;
                    }
                }

                if (!isValidDate) {
                    return { isValid: false } as any;
                }

                // Extract Requirements
                const cleanDesc = description
                    .replace(/\r\n|\n|\r/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/(\d)\. (\d)/g, '$1.$2');

                let requirements = cleanDesc
                    .split(/(?<=[.?!;])\s+(?=[A-Z])/)
                    .map(s => s.trim())
                    .filter(s => {
                        const lower = s.toLowerCase();
                        return s.length > 15 &&
                            s.length < 200 &&
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

                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const stableId = `${source.id}-${slug}-${amount}`;

                return {
                    id: stableId,
                    name: name,
                    provider: `${source.name} External Opportunities`,
                    amount: amount,
                    deadline: deadline || 'See Website',
                    description: description,
                    requirements: requirements,
                    region: 'National',
                    url: link,
                    isValid: true,
                    categories: categories
                };
            });

            const validScholarships = pageScholarships
                .filter((s: any) => s.isValid)
                .map(({ isValid, ...s }: any) => s as Scholarship);

            allScholarships = [...allScholarships, ...validScholarships];

            if (rows.length === 0) break;
            page++;
        }
    } catch (error) {
        // Silently fail for individual sources
    }

    return allScholarships;
};

// Firestore collection reference
const scholarshipsCollection = collection(db, 'scholarships');

// Cache for cursor-based pagination
let lastDocumentCache: Map<number, QueryDocumentSnapshot<DocumentData>> = new Map();

// Scrape and sync to Firestore
export const scrapeAndSyncScholarships = async (onProgress?: (count: number) => void): Promise<void> => {
    const SYNC_BATCH_SIZE = 5;
    const SYNC_MAX_PAGES = 8;
    let totalSynced = 0;

    for (let i = 0; i < SOURCES.length; i += SYNC_BATCH_SIZE) {
        const batch = SOURCES.slice(i, i + SYNC_BATCH_SIZE);

        const batchResults = await Promise.all(
            batch.map(source => fetchScholarshipsFromSource(source, SYNC_MAX_PAGES)
                .catch(() => [])
            )
        );

        const flatResults = batchResults.flat();

        if (flatResults.length > 0) {
            // Use Firestore batched writes for performance
            const firestoreBatch = writeBatch(db);

            flatResults.forEach(s => {
                const docRef = doc(db, 'scholarships', s.id);
                const deadline = new Date(s.deadline);

                firestoreBatch.set(docRef, {
                    id: s.id,
                    name: s.name,
                    amount: s.amount,
                    deadline: isNaN(deadline.getTime()) ? null : deadline.toISOString(),
                    link: s.url,
                    description: s.description,
                    requirements: s.requirements,
                    university_id: s.provider,
                    categories: s.categories,
                    updated_at: new Date().toISOString()
                });
            });

            try {
                await firestoreBatch.commit();
                totalSynced += flatResults.length;
            } catch (error) {
                console.error('Error syncing batch to Firestore:', error);
            }
        }

        if (onProgress) {
            onProgress(totalSynced);
        }
    }

    // Clear pagination cache after sync
    lastDocumentCache.clear();
};

// OPTIMIZED: Search scholarships from Firestore with cursor-based pagination
export const searchScholarships = async (
    page: number = 1,
    pageLimit: number = 20,
    onProgress?: (count: number) => void
): Promise<{ scholarships: Scholarship[], count: number }> => {

    try {
        // Get total count (cached by Firestore)
        const countSnapshot = await getCountFromServer(scholarshipsCollection);
        const totalCount = countSnapshot.data().count;

        if (totalCount === 0) {
            console.log('Firestore empty, falling back to live scraping...');
            return fallbackToLiveScraping(page, pageLimit, onProgress);
        }

        // Build query with cursor-based pagination for performance
        let q;
        if (page === 1) {
            // First page - no cursor needed
            q = query(scholarshipsCollection, orderBy('name'), limit(pageLimit));
        } else {
            // Get cursor from cache or fetch previous page
            const lastDoc = lastDocumentCache.get(page - 1);
            if (lastDoc) {
                q = query(scholarshipsCollection, orderBy('name'), startAfter(lastDoc), limit(pageLimit));
            } else {
                // Fallback: fetch from beginning (slower but works)
                const skipCount = (page - 1) * pageLimit;
                const prefetchQuery = query(scholarshipsCollection, orderBy('name'), limit(skipCount));
                const prefetchSnapshot = await getDocs(prefetchQuery);
                const lastVisible = prefetchSnapshot.docs[prefetchSnapshot.docs.length - 1];

                if (lastVisible) {
                    q = query(scholarshipsCollection, orderBy('name'), startAfter(lastVisible), limit(pageLimit));
                } else {
                    q = query(scholarshipsCollection, orderBy('name'), limit(pageLimit));
                }
            }
        }

        const snapshot = await getDocs(q);

        // Cache last document for next page
        if (snapshot.docs.length > 0) {
            lastDocumentCache.set(page, snapshot.docs[snapshot.docs.length - 1]);
        }

        const scholarships: Scholarship[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: data.id,
                name: data.name,
                provider: data.university_id,
                amount: data.amount,
                deadline: data.deadline ? new Date(data.deadline).toLocaleDateString() : 'See Website',
                description: data.description,
                requirements: data.requirements || [],
                region: 'National',
                url: data.link,
                categories: data.categories || categorizeScholarship(data.name, data.description)
            };
        });

        console.log(`Loaded ${scholarships.length} scholarships from Firestore (page ${page})`);
        return { scholarships, count: totalCount };

    } catch (error) {
        console.error('Error fetching from Firestore:', error);
        return fallbackToLiveScraping(page, pageLimit, onProgress);
    }
};

// Fallback to live scraping if Firestore is empty or fails
const fallbackToLiveScraping = async (
    page: number,
    pageLimit: number,
    onProgress?: (count: number) => void
): Promise<{ scholarships: Scholarship[], count: number }> => {

    const CACHE_KEY = 'scholarship_cache_v10';
    const CACHE_DURATION = 24 * 60 * 60 * 1000;

    let allResults: Scholarship[] = [];
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (cachedData) {
        try {
            const { timestamp, data } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
                allResults = data;
            }
        } catch {
            localStorage.removeItem(CACHE_KEY);
        }
    }

    if (allResults.length === 0) {
        const LIVE_BATCH_SIZE = 10;
        const LIVE_MAX_PAGES = 3;

        for (let i = 0; i < SOURCES.length; i += LIVE_BATCH_SIZE) {
            const batch = SOURCES.slice(i, i + LIVE_BATCH_SIZE);

            const batchResults = await Promise.all(
                batch.map(source => fetchScholarshipsFromSource(source, LIVE_MAX_PAGES)
                    .catch(() => [])
                )
            );

            batchResults.forEach(results => allResults.push(...results));

            if (onProgress) {
                onProgress(allResults.length);
            }
        }

        // Deduplicate
        const uniqueScholarships = Array.from(new Map(allResults.map(s => [s.id, s])).values());
        allResults = uniqueScholarships.sort(() => Math.random() - 0.5);

        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: allResults
        }));

        // Sync to Firestore in background
        syncToFirestoreInBackground(allResults);
    }

    const startIndex = (page - 1) * pageLimit;
    const paginatedResults = allResults.slice(startIndex, startIndex + pageLimit);

    return {
        scholarships: paginatedResults,
        count: allResults.length
    };
};

// Background sync to Firestore
const syncToFirestoreInBackground = async (scholarships: Scholarship[]) => {
    try {
        const BATCH_SIZE = 500; // Firestore max batch size

        for (let i = 0; i < scholarships.length; i += BATCH_SIZE) {
            const batchScholarships = scholarships.slice(i, i + BATCH_SIZE);
            const firestoreBatch = writeBatch(db);

            batchScholarships.forEach(s => {
                const deadline = new Date(s.deadline);
                if (isNaN(deadline.getTime())) return;

                const docRef = doc(db, 'scholarships', s.id);
                firestoreBatch.set(docRef, {
                    id: s.id,
                    name: s.name,
                    amount: s.amount,
                    deadline: deadline.toISOString(),
                    link: s.url,
                    description: s.description,
                    requirements: s.requirements,
                    university_id: s.provider,
                    categories: s.categories,
                    updated_at: new Date().toISOString()
                });
            });

            await firestoreBatch.commit();
        }
        console.log('Background sync to Firestore successful');
    } catch (error) {
        console.error('Background sync to Firestore failed:', error);
    }
};

// Get scholarships by IDs
export const getScholarshipsByIds = async (ids: string[]): Promise<Scholarship[]> => {
    if (!ids.length) return [];

    try {
        // Fetch each document individually (Firestore doesn't have IN query for IDs > 10)
        const promises = ids.map(id => getDoc(doc(db, 'scholarships', id)));
        const snapshots = await Promise.all(promises);

        return snapshots
            .filter(snap => snap.exists())
            .map(snap => {
                const data = snap.data()!;
                return {
                    id: data.id,
                    name: data.name,
                    provider: data.university_id,
                    amount: data.amount,
                    deadline: data.deadline ? new Date(data.deadline).toLocaleDateString() : 'See Website',
                    description: data.description,
                    requirements: data.requirements || [],
                    region: 'National',
                    url: data.link,
                    categories: data.categories || categorizeScholarship(data.name, data.description)
                };
            });
    } catch (error) {
        console.error('Error fetching scholarships by IDs:', error);
        return [];
    }
};
