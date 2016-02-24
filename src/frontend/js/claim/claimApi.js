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

    return fetch(`${API_URL}/pullrequests/${encodeURIComponent(repository)}/${encodeURIComponent(pullRequestNumber)}`, {
        headers,
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
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
