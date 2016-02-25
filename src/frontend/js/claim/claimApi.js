/* globals API_URL */
import { fetchEntityFactory } from '../app/entities/fetchEntities';

export const fetchPullRequest = ({ repository, pullRequestNumber }, jwt) => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
    };

    if (jwt) {
        headers['Authorization'] = jwt;
    }

    return fetch(`${API_URL}/claims/${encodeURIComponent(repository)}/${encodeURIComponent(pullRequestNumber)}`, {
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
        headers,
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(result => Promise.reject(new Error(result)));
        }

        return response.json();
    })
    .then(json => {
        return { item: json };
    }, error => ({
        error,
    }));
};

export const fetchClaim = ({ repository, pullRequestNumber, image }, jwt) => {
    const headers = {
        'Accept': 'application/json',
    };

    if (jwt) {
        headers['Authorization'] = jwt;
    }

    const body = new FormData();
    body.append('image', image);

    return fetch(`${API_URL}/claims/${encodeURIComponent(repository)}/${encodeURIComponent(pullRequestNumber)}`, {
        body,
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
        headers,
        method: 'POST',
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(result => Promise.reject(new Error(result)));
        }

        return response.json();
    })
    .then(json => {
        return { item: json };
    }, error => ({
        error,
    }));
};
