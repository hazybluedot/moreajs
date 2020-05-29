import { REQUEST_ITEMS, REQUEST_ITEM, SET_ITEMS, SET_ITEM } from "../actionTypes";

const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: [],
    modules: []
};

export default function(state = initialState, action) {
    const idx = state.items.findIndex(item => item.item.morea_id === action.payload.id);
    console.log('index found', idx);
    const payload = action.paylode;
    switch(action.type) {
    case REQUEST_ITEMS:
	return {...state, 
		isFetching: true
	       }
    case REQUEST_ITEM:
	console.log('requestiong item at index', idx);
	const req_item = {...state.items[idx], isFetching: true};
	return {...state,
		items: [...state.items.slice(0, idx), req_item, ...state.items.slice(idx+1)]
	       }
    case SET_ITEM:
	if (action.error === undefined && idx >= 0) {
	    console.log('setting item at index', idx);
	    const set_item = {
		...state.items[idx],
		...action.payload,
		index: idx};
	    return {
		...state,
		items: [...state.items.slice(0, idx), set_item, ...state.items.slice(idx+1)]
		//works because if begin is greater than index range, an
		//empty array is returned
		//(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
	    }
	} else {
	    if (action.error && idx) {
		console.log('handling set item error', action.error);
		return {
		    ...state,
		    items: [...state.items.slice(0, idx), {...state.items[idx], ...action.payload, error: action.error}, ...state.items.slice(idx+1)]
		}
	    }
	    return state
	}
    case SET_ITEMS:
	console.log('SET_ITEMS', action);
	return {...state,
		isFetching: false,
		items: action.payload.map((item, idx) => ({...item, index: idx})),
		lastUpdated: action.receivedAt
	       };
    default:
	return state;
    }
}
