import fetch from '@/utils/fetch';

export function getList(params) {
    return fetch({
        url: '/user/list',
        method: 'get',
        params
    });
}

export function fetchList(query) {
    return fetch({
        url: '/userex/list',
        method: 'get',
        params: query
    });
}

export function fetchPv(pv) {
    return fetch({
        url: '/userex/pv',
        method: 'get',
        params: { pv }
    });
}
