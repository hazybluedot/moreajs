const apibase = 'https://efcms.engr.utk.edu/ef105-2020-08/apidev/library';

const fetchItemPath = (item) => {
    console.log('fetchItemPath', item);
    let query = null;
    let path = '';
    if (item && item.working) {
	query = 'workingCopy=1';
    }
    if (item && item.morea_type && item.morea_id) {
	path = `${item.morea_type}/${item.morea_id}`;
    } else {
	return null;
    }

    return query ? path + '?' + query : path;
};

export async function fetcher(key) {
    const itemPath = fetchItemPath(key);
    const url = itemPath ? `${apibase}/items/${itemPath}` : `${apibase}/items/`;

    console.log(`fetcher fetching ${url}`);
    /*
    return fetch(url)
    .then(response => response.json())*/
    const res = await fetch(url);
    return res.json();
};

export function putter(key) {
};
