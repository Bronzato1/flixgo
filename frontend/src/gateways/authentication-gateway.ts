import { Router } from 'aurelia-router';
import { Aurelia, inject, autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

@autoinject()
export class AuthenticationGateway {

    // As soon as the AuthenticationService is created, we query local storage to
    // see if the login information has been stored. If so, we immediately
    // load it into the session object on the AuthenticationService.

    constructor(aurelia: Aurelia, httpClient: HttpClient, router: Router) {
        this.aurelia = aurelia;
        this.httpClient = new HttpClient();
        this.router = router;
        this.session = JSON.parse(localStorage[this.tokenName] || null);
    }

    aurelia: Aurelia;
    httpClient: HttpClient;
    router: Router;
    session = null;
    tokenName = 'FlixGoToken';

    login(username, password) {
        // this.httpClient
        //     .post(config.loginUrl, { username, password })
        //     .then((response) => response.content)
        //     .then((session) => {

        let session = {
            usename: 'admin',
            role: ['ADMINISTRATOR']
        };

        // Save to localStorage
        localStorage[this.tokenName] = JSON.stringify(session);

        // .. and to the session object
        this.session = session;

        this.router.navigate('/', { replace: true, trigger: false });
        this.router.reset();

        // .. and set root to private.
        this.aurelia.setRoot('private');
        //    });
    }
    logout() {

        // Clear from localStorage
        localStorage[this.tokenName] = null;

        // .. and from the session object
        this.session = null;

        this.router.navigate('/', { replace: true, trigger: false });
        this.router.reset();

        // .. and set root to login.
        this.aurelia.setRoot('public')
    }
    isAuthenticated() {
        return this.session !== null;
    }
    can(permission) {
        return true; // why not?
    }
}