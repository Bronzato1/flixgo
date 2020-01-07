import { YoutubeGateway } from 'gateways/youtube-gateway';
import { autoinject, bindable } from 'aurelia-framework';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { IFilter } from '../interfaces/filter-interface';

@autoinject()
export class SectionHeader {

  constructor(router: Router, eventAgregator: EventAggregator, youtubeGateway: YoutubeGateway) {
    this.router = router;
    this.ea = eventAgregator;
    this.youtubeGateway = youtubeGateway;
  }

  ea: EventAggregator;
  subscription: Subscription;
  youtubeGateway: YoutubeGateway;
  filters: IFilter;
  router: Router;
  
  bind() {
    this.eventAggregatorSubscription();
  }
  unbind() {
    this.eventAggregatorUnsubscription();
  }
  attached() {

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
  eventAggregatorSubscription() {
    this.subscription = this.ea.subscribe('filtering', (response: IFilter) => {
      this.filters = response;
    });
  }
  eventAggregatorUnsubscription() {
    this.subscription.dispose();
  }
  submitSearch() {
    this.ea.publish('filtering', this.filters);
  }
  signIn() {
    this.router.navigate('signIn');
  }
  signOut() {
    this.youtubeGateway.signOut();
  }
}
