import {REQUEST_ITEMS, REQUEST_ITEM, SET_ITEMS, SET_ITEM} from "./actionTypes";

export const requestItems = () => ({
    type: REQUEST_ITEMS
});

export const requestItem = (item) => ({
    type: REQUEST_ITEM,
    payload: {...item, id: item.morea_id}
});

export const setItems = items => ({
    type: SET_ITEMS,
    payload: items,
    meta: { receivedAt: Date.now() }
});

export const setItem = (container, error) => ({
    type: SET_ITEM,
    payload: container,
    error: error,
    meta: { receivedAt: Date.now() }
});

const fetchItemPath = (item) => {
    if (item && item.morea_type && item.morea_id) {
	return `${item.morea_type}/${item.morea_id}`;
    } else {
	return null;
    }
};

const apibase = 'https://efcms.engr.utk.edu/ef105-2020-08/apidev/library';

export function fetchItems(req) {
    let fetchCount = {};
    const addFetch = (url) => {
	fetchCount[url] = fetchCount[url] === undefined ? 1 : fetchCount[url] + 1;
    }
    
    return (dispatch, getState) => {
	const itemPath = fetchItemPath(req);

	if (itemPath) {
	    dispatch(requestItem(req));
	} else {
	    dispatch(requestItems());
	}
	const url = itemPath ? `${apibase}/items/${itemPath}` : `${apibase}/items/`;

	if (fetchCount[url] !== undefined && fetchCount[url] > 3) {
	    console.log(`aborting fetch of ${url}, over limit`);
	    return null;
	}
	console.log('fetching', url);
	addFetch(url);
	return fetch(url)
	    .then(response => response.json())
	    .then(json => {
		if (itemPath) {
		    if (json.morea_id) {
			dispatch(setItem({isFetching: false, isLoaded: true, id: json.morea_id, item: json}));
		    } else {
			console.log('setItem with error', {...json, id: item.morea_id });
			dispatch(setItem({isFetching: false, isLoaded: false, id: item.morea_id }, json))
		    }
		} else {
		    dispatch(setItems(json.map(item => ({isFetching: false,
							 isLoaded: false,
							 item: item
							}))));
		}
	    });
    }
}

export function saveItem(req) {
    const itemPath = fetchItemPath(req);
    const url = itemPath ? `${apibase}/items/${itemPath}` : `${apibase}/items/`;

    const {morea_id, morea_type} = req;
    const payload = {payload: {id: morea_id, morea_type: morea_type}};

    return (dispatch, getState) => {
	if (itemPath) {
	    dispatch(setItem({payload: req, isPending: true}));
	} else {
	    return null;
	}
	
	console.log('putting item', itemPath, req);
	
	return fetch(url, {method: 'PUT',
			   headers: {'Content-Type': 'application/json'},
			   body: JSON.stringify(req)
			  }).then(resp => {
			      if (!resp.ok) {
				  //could be a access denied, or actual network error.
				  throw new Error('Network response was not ok');
			      }
			      return resp.json();
			  })
	    .then(json => {
		console.log('successful request', json);
	    })
	    .catch((error) => {
		//dispatch(appendMessage({'type': 'error', message: error}));
		console.log('catch network error', error);
		dispatch(setItem({...payload, error: error}));
	    })
	    .finally(() => {
		dispatch(setItem({...payload, isPending: false}));
	    });
    };
};
