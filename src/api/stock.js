import fetch from '@/utils/fetch';

export function fetchList(params) {
    return fetch({
        url: '/stock/list',
        method: 'post',
        params
    });
}

export function fetchInsert(params) {
    return fetch({
        url: '/stock/insert',
        method: 'post',
        params
    });
}

export function fetchUpdate(params) {
    return fetch({
        url: '/stock/update',
        method: 'post',
        params
    });
}

export function fetchRemove(params) {
    return fetch({
        url: '/stock/remove',
        method: 'post',
        params
    });
}

export function fetchPv(params) {
    return fetch({
        url: '/stock/pv',
        method: 'post',
        params
    });
}