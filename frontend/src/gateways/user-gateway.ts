import { Router } from 'aurelia-router';
import { Aurelia, inject, autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
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
            });
    }
    getById(id): Promise<User> {
        return this.httpClient.fetch(`api/user/${id}`)
            .then(response => response.json())
            .then(User.fromObject);
    }
    deleteById(id): Promise<void> {
        return this.httpClient.fetch(`api/user/${id}`, {
            method: 'delete'
        })
            .then((response: Response) => {
                console.log('Result ' + response.status + ': ' + response.statusText);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
}