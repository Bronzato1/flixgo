/// <reference path="../../../global.d.ts" />

import 'jquery.magnific-popup.min';
import { UserGateway } from 'gateways/user-gateway';
import { User } from 'models/user-model';
import { BindingEngine, autoinject, observable } from 'aurelia-framework';

@autoinject()
export class SectionMainContent {

    constructor(userGateway: UserGateway) {
        this.userGateway = userGateway;
    }

    userGateway: UserGateway;
    userId: number;
    user: User;
    subscriptionOptions = [];
    rightsOptions = [];

    async bind(params) {
        this.userId = params.userId;
        this.user = await this.userGateway.getById(this.userId);
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
        alert(this.user.subscription);
    }
    changePassword() {
        this.user.subscription = 1;
    }
}