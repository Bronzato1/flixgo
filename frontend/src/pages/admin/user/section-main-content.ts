/// <reference path="../../../global.d.ts" />

import { User } from 'models/user-model';
import { UserGateway } from './../../../gateways/user-gateway';
import { autoinject, computedFrom, observable } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { IFilter, IPager } from '../../../interfaces/filter-interface';
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
    totalItems: User[];
    pagedItems: User[];
    pager: IPager;
    @observable()
    filter: string;

    created() {
    }
    bind() {
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
    async attached() {

        const wait = (ms) => new Promise(res => setTimeout(res, ms));
        await this.userGateway.getAll().then((data) => this.totalItems = data);
        this.setPage(1);
        await wait(100);
        this.initializeMagnificPopup();
    }
    deleteUser(userId) {
        this.userGateway
            .deleteById(userId)
            .then(() => {
                console.log(`User #${userId} deleted`);
                var user = this.pagedItems.find(x => x.id == userId);
                user.status = 2; // Deleted
            })
            .catch((err) => console.log('Error: ' + err));
    }
    statusChange(userId) {
        var user = this.pagedItems.find(x => x.id == userId);
        var newStatus;

        switch (user.status) {
            case 0:
                this.userGateway
                    .banUser(userId)
                    .then(() => {
                        console.log(`User #${userId} banned`);
                        user.status = 1;
                    })
                    .catch((err) => console.log('Error: ' + err));
                break;
            case 1:
                this.userGateway
                    .approveUser(userId)
                    .then(() => {
                        console.log(`User #${userId} approved`);
                        user.status = 0;
                    })
                    .catch((err) => console.log('Error: ' + err));
                break;
            case 2:
                alert('Status change denied. Reason: user already deleted.');
                return;
                break;
        }
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
    range(start, end) {
        return Array.from(new Array(end - start), (x, i) => i + start)
    }
    setPage(page) {

        var self = this;

        // get pager object from service
        this.pager = this.getPager(this.filteredItems.length, page, 10);

        if (page < 1 || this.pager && page > this.pager.totalPages) {
            this.pagedItems = [];
            return;
        }

        // get current page of items
        this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }
    getPager(totalItems, currentPage, pageSize): IPager {

        // default to first page
        currentPage = currentPage || 1;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 5) {
            // less than 5 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 5 total pages so calculate start and end pages
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 3 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = this.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
    filterChanged() {
        this.setPage(1);
    }
    get filteredItems() {

        if (!this.totalItems) return [];

        var filteredItems: User[] = this.totalItems.slice();

        if (this.filter)
            filteredItems = filteredItems.filter(x => x.userName.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase()));

        return filteredItems;
    }
}
