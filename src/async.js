import fetch from "isomorphic-unfetch";

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

export const fetchKey = (item) => `${apibase}/items/${fetchItemPath(item)}`;

export function itemFetcher(morea_type, morea_id, view) {
    const url = `${apibase}/items/${morea_type}/${morea_id}`;
    const query = view === "working" ? 'workingCopy=1' : null;
    const req = query ? url + '?' + query : url;
    console.log('fetchItem ' + req);
    return fetch(req).then(res => res.json());
}

export function putItem(item) {
    const url = `${apibase}/items/${item.morea_type}/${item.morea_id}`;
    return fetch(url,{method: 'PUT',
		      headers: {'Content-Type': 'application/json'},
		      body: JSON.stringify(item)
		     }).then(resp => resp.json());
};

export function fetcher(...key) {
    //const itemPath = fetchItemPath(...key);
    //const url = itemPath ? `${apibase}/items/${itemPath}` : `${apibase}/items/`;

    console.log(`fetcher fetching ${key}`);

    return fetch(...key)
	.then(response => response.json())

    /*
    const res = await fetch(url);
    return res.json();*/
};

export function putter(key) {
};
