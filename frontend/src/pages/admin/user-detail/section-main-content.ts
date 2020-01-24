/// <reference path="../../../global.d.ts" />

import { UserGateway } from 'gateways/user-gateway';
import { User } from 'models/user-model';
import { BindingEngine, autoinject, observable } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";
import { Router } from 'aurelia-router';
import 'jquery.magnific-popup.min';

@autoinject()
export class SectionMainContent {

    constructor(userGateway: UserGateway, eventAgregator: EventAggregator, router: Router, validationController: ValidationControllerFactory) {
        this.userGateway = userGateway;
        this.ea = eventAgregator;
        this.router = router;
        this.validationController = validationController.createForCurrentScope();
    }

    userGateway: UserGateway;
    ea: EventAggregator;
    router: Router;
    validationController: ValidationController;
    subscriptions: Subscription[] = [];
    userId: number;
    user: User;
    subscriptionOptions = [];
    rightsOptions = [];

    wait = (ms) => new Promise(res => setTimeout(res, ms));

    bind(params) {

        if (params.userId)
            this.userId = params.userId;

        this.eventAggregatorSubscription();
    }
    unbind() {
        this.eventAggregatorUnsubscription();
    }
    eventAggregatorSubscription() {
        this.subscriptions.push(this.ea.subscribe('userToDelete', (userId) => this.deleteUser(userId)));
        this.subscriptions.push(this.ea.subscribe('statusChange', (userId) => this.statusChange(userId)));
    }
    eventAggregatorUnsubscription() {
        this.subscriptions.forEach(x => x.dispose());
    }
    async attached() {

        if (this.userId) {
            await this.userGateway.getById(this.userId).then((data) => this.user = data);
            await this.wait(10);
        }
        else {
            this.user = new User();
            this.user.status = 0; // Approved
        }

        this.initializeSelect2Options();
        this.initializeMagnificPopup();
        this.manageValidationRules();
    }
    initializeSelect2Options() {

        this.subscriptionOptions = [
            { label: 'Basic', value: 0 },
            { label: 'Premium', value: 1 },
            { label: 'Cinematic', value: 2 }
        ];

        this.rightsOptions = [
            { label: 'User', value: 0 },
            { label: 'Moderator', value: 1 },
            { label: 'Administrator', value: 2 }
        ];
    }
    initializeMagnificPopup() {

        (<any>$('.open-modal')).magnificPopup({
            fixedContentPos: true,
            fixedBgPos: true,
            overflowY: 'auto',
            type: 'inline',
            preloader: false,
            focus: '#username',
            modal: false,
            removalDelay: 300,
            mainClass: 'my-mfp-zoom-in',
        });

        $('.modal__btn--dismiss').on('click', function (e) {
            e.preventDefault();
            $.magnificPopup.close();
        });
    }
    manageValidationRules() {
        ValidationRules
            .ensure((x: User) => x.userName).required()
            .ensure((x: User) => x.firstName).required()
            .ensure((x: User) => x.lastName).required()
            .ensure((x: User) => x.email).required()
            .ensure((x: User) => x.status).required()
            .ensure((x: User) => x.subscription).required()
            .ensure((x: User) => x.rights).required()
            .on(this.user);

        this.validationController.addObject(this.user);
    }
    getStatusText(status) {
        switch (status) {
            case 0:
                return 'Approved';
                break;
            case 1:
                return 'Banned';
                break;
            case 2:
                return 'Deleted';
                break;
        }
    }
    getStatusClass(status) {
        switch (status) {
            case 0:
                return 'profile__meta--green';
                break;
            case 1:
                return 'profile__meta--red';
                break;
            case 2:
                return 'profile__meta--red';
                break;
        }
    }
    async saveChanges() {

        var self = this;
        var validation = await this.validationController.validate();

        if (!validation.valid) {
            $.magnificPopup.open({
                fixedContentPos: true,
                fixedBgPos: true,
                overflowY: 'auto',
                type: 'inline',
                preloader: false,
                focus: '#username',
                modal: false,
                removalDelay: 300,
                mainClass: 'my-mfp-zoom-in',
                closeOnContentClick: true,
                items: {
                    src: '#modal-notification'
                },
                callbacks: {
                    beforeOpen: function () {
                        var h6 = document.getElementById('title-notification');
                        h6.innerHTML = 'Validation failed';
                        var p = document.getElementById('text-notification');
                        p.innerHTML = 'Please check your changes before trying to save.';
                    }
                }
            });
            return;
        }

        if (this.userId)

            this.userGateway.updateUser(this.user)
                .then(() => {
                    $.magnificPopup.open({
                        fixedContentPos: true,
                        fixedBgPos: true,
                        overflowY: 'auto',
                        type: 'inline',
                        preloader: false,
                        focus: '#username',
                        modal: false,
                        removalDelay: 300,
                        mainClass: 'my-mfp-zoom-in',
                        closeOnContentClick: true,
                        items: {
                            src: '#modal-notification'
                        },
                        callbacks: {
                            beforeOpen: function () {
                                var h6 = document.getElementById('title-notification');
                                h6.innerHTML = 'Data saved';
                                var p = document.getElementById('text-notification');
                                p.innerHTML = 'Data saved successfully in DB<br/>Click to close';
                            },
                            afterClose: function () {
                                self.router.navigate('users');
                            }
                        }
                    });
                })
                .catch((err) => {
                    $.magnificPopup.open({
                        fixedContentPos: true,
                        fixedBgPos: true,
                        overflowY: 'auto',
                        type: 'inline',
                        preloader: false,
                        focus: '#username',
                        modal: false,
                        removalDelay: 300,
                        mainClass: 'my-mfp-zoom-in',
                        closeOnContentClick: true,
                        items: {
                            src: '#modal-notification'
                        },
                        callbacks: {
                            beforeOpen: function () {
                                var h6 = document.getElementById('title-notification');
                                h6.innerHTML = 'Error';
                                var p = document.getElementById('text-notification');
                                p.innerHTML = err.status + ' ' + err.statusText;
                            }
                        }
                    });
                });

        else

            this.userGateway.createUser(this.user)
                .then(() => {
                    $.magnificPopup.open({
                        fixedContentPos: true,
                        fixedBgPos: true,
                        overflowY: 'auto',
                        type: 'inline',
                        preloader: false,
                        focus: '#username',
                        modal: false,
                        removalDelay: 300,
                        mainClass: 'my-mfp-zoom-in',
                        closeOnContentClick: true,
                        items: {
                            src: '#modal-notification'
                        },
                        callbacks: {
                            beforeOpen: function () {
                                var h6 = document.getElementById('title-notification');
                                h6.innerHTML = 'Data saved';
                                var p = document.getElementById('text-notification');
                                p.innerHTML = 'Data saved successfully in DB<br/>Click to close';
                            },
                            afterClose: function () {
                                self.router.navigate('users');
                            }
                        }
                    });
                })
                .catch((err) => {
                    $.magnificPopup.open({
                        fixedContentPos: true,
                        fixedBgPos: true,
                        overflowY: 'auto',
                        type: 'inline',
                        preloader: false,
                        focus: '#username',
                        modal: false,
                        removalDelay: 300,
                        mainClass: 'my-mfp-zoom-in',
                        closeOnContentClick: true,
                        items: {
                            src: '#modal-notification'
                        },
                        callbacks: {
                            beforeOpen: function () {
                                var h6 = document.getElementById('title-notification');
                                h6.innerHTML = 'Error';
                                var p = document.getElementById('text-notification');
                                p.innerHTML = err.status + ' ' + err.statusText;
                            }
                        }
                    });
                });
    }
    changePassword() {
    }
    deleteUser(userId) {

        var self = this;

        this.userGateway
            .deleteUser(userId)
            .then(() => {
                $.magnificPopup.open({
                    fixedContentPos: true,
                    fixedBgPos: true,
                    overflowY: 'auto',
                    type: 'inline',
                    preloader: false,
                    focus: '#username',
                    modal: false,
                    removalDelay: 300,
                    mainClass: 'my-mfp-zoom-in',
                    closeOnContentClick: true,
                    items: {
                        src: '#modal-notification'
                    },
                    callbacks: {
                        beforeOpen: function () {
                            var h6 = document.getElementById('title-notification');
                            h6.innerHTML = 'User deleted';
                            var p = document.getElementById('text-notification');
                            p.innerHTML = 'User deleted in DB<br/>Click to close';
                        },
                        afterClose: function () {
                            self.router.navigate('users');
                        }
                    }
                });
            })
            .catch((err) => console.log('Error: ' + err));
    }
    statusChange(userId) {

        switch (this.user.status) {
            case 0:
                this.userGateway
                    .banUser(userId)
                    .then(() => {
                        console.log(`User #${userId} banned`);
                        this.user.status = 1;
                    })
                    .catch((err) => console.log('Error: ' + err));
                break;
            case 1:
                this.userGateway
                    .approveUser(userId)
                    .then(() => {
                        console.log(`User #${userId} approved`);
                        this.user.status = 0;
                    })
                    .catch((err) => console.log('Error: ' + err));
                break;
            case 2:
                alert('Status change denied. Reason: user already deleted.');
                return;
                break;
        }
    }
}