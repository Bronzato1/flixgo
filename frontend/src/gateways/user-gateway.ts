import { Router } from 'aurelia-router';
import { Aurelia, inject, autoinject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import environment from 'environment';
import { User } from '../models/user-model';

@autoinject()
export class UserGateway {

    constructor(httpClient: HttpClient, router: Router) {
        this.httpClient = httpClient.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.backendUrl);
        });
        this.router = router;
    }

    httpClient: HttpClient;
    router: Router;

    getAll(): Promise<User[]> {
        return this.httpClient.fetch(`api/user/`)
            .then(response => response.json())
            .then(dto => {
                return dto.map(User.fromObject);
            }).catch((error) => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                throw error;
            });
    }
    getById(id): Promise<User> {
        return this.httpClient.fetch(`api/user/${id}`)
            .then(response => response.json())
            .then(User.fromObject)
            .catch((error) => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                throw error;
            });
    }
    deleteUser(id): Promise<void> {
        return this.httpClient.fetch(`api/user/${id}`, {
            method: 'delete'
        })
            .then((response: Response) => {
                console.log('Result ' + response.status + ': ' + response.statusText);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                throw error;
            });
    }
    createUser(user: User): Promise<void | User> {

        return this.httpClient.fetch(`api/user`, {
            method: 'post',
            body: json(user)
        })
            .then(response => response.json())
            .then(User.fromObject)
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                throw error;
            });
    }
    updateUser(user: User): Promise<void | User> {

        return this.httpClient.fetch(`api/user/${user.id}`, {
            method: 'put',
            body: json(user)
        })
            .then((response: Response) => {
                console.log('Result ' + response.status + ': ' + response.statusText);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                throw error;
            });
    }
    approveUser(id) {
        var data = { userId: id };
        return this.httpClient.fetch(`api/user/approveUser`, {
            method: 'POST', body: json(data)
        }).catch((error) => {
            console.log('Result ' + error.status + ': ' + error.statusText);
            throw error;
        });
    }
    banUser(id) {
        var data = { userId: id };
        return this.httpClient.fetch(`api/user/banUser`, {
            method: 'POST', body: json(data)
        }).catch((error) => {
            console.log('Result ' + error.status + ': ' + error.statusText);
            throw error;
        });
    }
}