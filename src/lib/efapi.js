import fetch from "isomorphic-unfetch";
import efConfig from "./efconfig";
import AbortController from "abort-controller";

const controller = new AbortController();
const signal = controller.signal;

export function abort() {
    controller.abort();
};

export function itemFetcher(morea_type, morea_id, view) {
    const url = morea_type && morea_id ? `${efConfig.apiBase}/library/items/${morea_type}/${morea_id}` : `${efConfig.apiBase}/library/items/`;
    const query = view === "working" ? 'workingCopy=1' : null;
    const req = query ? url + '?' + query : url;
    console.log('fetchItem ' + req);
    return fetch(req, {signal})
        .then(res => res.json());
}

export function putItem(item) {
    const url = `${efConfig.apiBase}/library/items/${item.morea_type}/${item.morea_id}`;
    return fetch(url, {
        method: 'PUT',
        signal: signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    }).then(resp => resp.json());
};

export function fetchEnv() {
    const url = `${efConfig.apiBase}/env`;
    return fetch(url, {signal})
        .then(resp => resp.json());
};

export function moduleFetcher(module_id) {
    const url = `${efConfig.apiBase}/modules/`;
    return fetch(url, {signal})
        .then(resp => resp.json());
};

export const itemKey = (item) => `${item.morea_type}-${item.morea_id}`;
