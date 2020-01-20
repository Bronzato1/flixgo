/// <reference path="../../../global.d.ts" />

import { User } from 'models/user-model';
import { UserGateway } from './../../../gateways/user-gateway';
import { autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import 'jquery.magnific-popup.min';

@autoinject()
export class SectionMainContent {

    constructor(userGateway: UserGateway, eventAgregator: EventAggregator) {
        this.userGateway = userGateway;
        this.ea = eventAgregator;
    }

    userGateway: UserGateway;
    ea: EventAggregator;
    subscription: Subscription;
    users: User[];

    created() {
    }
    bind() {
        this.eventAggregatorSubscription();
    }
    unbind() {
        this.eventAggregatorUnsubscription();
    }
    eventAggregatorSubscription() {
        this.subscription = this.ea.subscribe('userToDeleted', (userId) => {
            this.userGateway
                .deleteById(userId)
                .then(() => {
                    console.log(`User #${userId} deleted`);
                    var user = this.users.find(x => x.id == userId);
                    user.status = 2; // Deleted
                })
                .catch((err) => console.log('Error: ' + err));
        });
    }
    eventAggregatorUnsubscription() {
        this.subscription.dispose();
    }
    async attached() {

        const wait = (ms) => new Promise(res => setTimeout(res, ms));
        await this.userGateway.getAll().then((data) => this.users = data);
        await wait(100);

        this.initializeMagnificPopup();
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
            mainClass: 'my-mfp-zoom-in'
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
                return 'main__table-text--green';
                break;
            case 1:
                return 'main__table-text--red';
                break;
            case 2:
                return 'main__table-text--red';
                break;
        }
    }
}
