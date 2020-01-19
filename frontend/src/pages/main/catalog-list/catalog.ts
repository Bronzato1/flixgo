import { bindable } from 'aurelia-framework';
import { Router, activationStrategy } from 'aurelia-router';
import * as noUiSlider from 'nouislider';
import * as wNumb from 'wnumb';

export class Catalog {

  channelId: string;

  determineActivationStrategy() {
    return activationStrategy.replace;
  }
  activate(params) {
    this.channelId = params.channelId;
  }
  attached() {
    this.initializeFirstSlider();
  }
  initializeFirstSlider() {
    if ($('#filter__releaseYears').length) {
      var secondSlider = document.getElementById('filter__releaseYears');
      noUiSlider.create(secondSlider, {
        range: {
          'min': 2000,
          'max': 2020
        },
        step: 1,
        connect: true,
        start: [2000, 2020],
        format: wNumb({
          decimals: 0,
        })
      });

      var secondValues = [
        document.getElementById('releaseYearStart'),
        document.getElementById('releaseYearEnd')
      ];

      (<any>secondSlider).noUiSlider.on('update', function (values, handle) {
        secondValues[handle].innerHTML = values[handle];
      });

      $('.filter__item-menu--range').on('click.bs.dropdown', function (e) {
        e.stopPropagation();
        e.preventDefault();
      });
    } else {
      return false;
    }
    return false;
  }
}
