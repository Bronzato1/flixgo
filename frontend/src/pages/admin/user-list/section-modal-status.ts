import { autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

@autoinject()
export class SectionModalStatus {

    constructor(eventAgregator: EventAggregator) {
        this.ea = eventAgregator;
    }

    ea: EventAggregator;

    statusChange() {
        var mp = $.magnificPopup.instance;
        var target = $(mp.currItem.el[0]);
        var userId = target.data('user-id');
        this.ea.publish('statusChange', userId);
        $.magnificPopup.close();
    }
}