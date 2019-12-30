import { autoinject, bindable } from 'aurelia-framework';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { IFilter } from '../interfaces/filter-interface';

@autoinject()
export class SectionHeader {
  constructor(router: Router, eventAgregator: EventAggregator) {
    this.router = router;
    this.ea = eventAgregator;
  }
  private ea: EventAggregator;
  private subscription: Subscription;
  private filters: IFilter;
  private router: Router;
  private attached() {

    this.filteringSubscription();

    $(document).ready(function () {
      $('.header__btn').on('click', function () {
        $(this).toggleClass('header__btn--active');
        $('.header__nav').toggleClass('header__nav--active');
        $('.body').toggleClass('body--active');

        if ($('.header__search-btn').hasClass('active')) {
          $('.header__search-btn').toggleClass('active');
          $('.header__search').toggleClass('header__search--active');
        }
      });
    });

    $('.header__search-btn').on('click', function () {
      $(this).toggleClass('active');
      $('.header__search').toggleClass('header__search--active');

      if ($('.header__btn').hasClass('header__btn--active')) {
        $('.header__btn').toggleClass('header__btn--active');
        $('.header__nav').toggleClass('header__nav--active');
        $('.body').toggleClass('body--active');
      }
    });
  }
  private filteringSubscription() {
    this.subscription = this.ea.subscribe('filtering', (response: IFilter) => {
      this.filters = response;
    });
  }
  private submitSearch() {
    this.ea.publish('filtering', this.filters);
  }
}
