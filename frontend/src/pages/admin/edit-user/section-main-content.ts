/// <reference path="../../../global.d.ts" />

import { UserGateway } from 'gateways/user-gateway';
import { User } from 'models/user-model';
import { BindingEngine, autoinject, observable } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import 'jquery.magnific-popup.min';
import { threadId } from 'worker_threads';

@autoinject()
export class SectionMainContent {

    constructor(userGateway: UserGateway, eventAgregator: EventAggregator) {
        this.userGateway = userGateway;
        this.ea = eventAgregator;
    }

    userGateway: UserGateway;
    ea: EventAggregator;
    subscription: Subscription;
    userId: number;
    user: User;
    subscriptionOptions = [];
    rightsOptions = [];

    async bind(params) {
        this.userId = params.userId;
        this.user = await this.userGateway.getById(this.userId);
        this.eventAggregatorSubscription();
    }
    unbind() {
        this.eventAggregatorUnsubscription();
    }
    eventAggregatorSubscription() {
        this.subscription = this.ea.subscribe('userToDelete', (userId) => this.deleteUser(userId));
        this.subscription = this.ea.subscribe('statusChange', (userId) => this.statusChange(userId));
    }
    eventAggregatorUnsubscription() {
        this.subscription.dispose();
    }
    attached() {
        this.initializeSelect2Options();
        this.initializeMagnificPopup();
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
    saveChanges() {
        this.userGateway.updateById(this.user)
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
                        src: '#modal-saved'
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
                        src: '#modal-error'
                    },
                    callbacks: {
                        beforeOpen: function () {
                            var div = document.getElementById('errorMessage');
                            div.innerHTML = err.status + ' ' + err.statusText;
                        }
                    }
                });
            });
    }
    changePassword() {
    }
    deleteUser(userId) {
        this.userGateway
            .deleteById(userId)
            .then(() => {
                console.log(`User #${userId} deleted`);
                this.user.status = 2; // Deleted
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