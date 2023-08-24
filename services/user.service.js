import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    Login,
    logout,
    register,
    isAdmin,
    forgotPassword,
    resetPassword,
    getAll,
    getById,
    update,
    delete: _delete
};

async function Login(email, password) {
    const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { email, password });

    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
}

async function forgotPassword(email) {
    await fetchWrapper.post(`${baseUrl}/forgotPassword`, { email });

    
    alertService.success('Please check your email for password reset instructions');
}

async function resetPassword({ token, password, confirmPassword}) {
    await fetchWrapper.post(`${baseUrl}/resetPassword`, { token, password, confirmPassword });

    Router.push('/account/Login');
    alertService.success('Password reset successful, you can now Login');
}
async function isAdmin(id) {

    const user = await fetchWrapper.get(`${baseUrl}/${id}`);

    return user;
}


function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to Login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/Login');
}

async function register(user) {
    await fetchWrapper.post(`${baseUrl}/register`, user);
}

async function getAll() {
    return await fetchWrapper.get(baseUrl);
}

async function getById(id) {
    return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function update(id, params) {
    await fetchWrapper.put(`${baseUrl}/${id}`, params);

    // update stored user if the logged in user updated their own record
    if (id === userSubject.value.id) {
        // update local storage
        const user = { ...userSubject.value, ...params };
        localStorage.setItem('user', JSON.stringify(user));

        // publish updated user to subscribers
        userSubject.next(user);
    }
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
    await fetchWrapper.delete(`${baseUrl}/${id}`);

    // auto logout if the logged in user deleted their own record
    if (id === userSubject.value.id) {
        logout();
    }
}
