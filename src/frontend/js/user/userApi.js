/* globals API_URL, GITHUB_CLIENT_ID */
import hellojs from 'hellojs';

export function fetchSignIn(email, password) {
    return fetch(`${API_URL}/sign-in`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            email,
            password,
        }),
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
        return { user: json };
    }, error => ({
        error,
    }));
}

export function fetchSignUp(email, password) {
    return fetch(`${API_URL}/sign-up`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            email,
            password,
        }),
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
        return { user: json };
    }, error => ({
        error,
    }));
}

export const signInWithGithub = () => new Promise((resolve) => {
    hellojs.init({
        github: GITHUB_CLIENT_ID,
    }, {
        oauth_proxy: `${API_URL}/oauthproxy`,
    });

    hellojs
        .login('github')
        .then(auth => {
            hellojs(auth.network).api('/me').then(user => {
                resolve({
                    user: {
                        access_token: auth.authResponse.access_token,
                        ...user,
                    },
                });
            });
        }, err => resolve({ error: err.error }));
});

export const storeLocalUser = ({ id, email, token, expires }) => {
    localStorage.setItem('id', id);
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('expires', expires);
};

export const removeLocalUser = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
};
