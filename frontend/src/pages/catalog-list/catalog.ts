import { bindable } from 'aurelia-framework';
import { Router, activationStrategy } from 'aurelia-router';
import * as noUiSlider from 'nouislider';
import * as wNumb from 'wnumb';

export class Catalog {
  private determineActivationStrategy() {
    return activationStrategy.replace;
  }
  private activate() {
  }
  private attached() {
    this.initializeFirstSlider();
    this.initializeSecondSlider();
    this.initializeThirdSlider();
  }
  private initializeFirstSlider() {
    if ($('#filter__years').length) {
      var firstSlider = document.getElementById('filter__years');
      noUiSlider.create(firstSlider, {
        range: {
          'min': 2000,
          'max': 2018
        },
        step: 1,
        connect: true,
        start: [2005, 2015],
        format: wNumb({
          decimals: 0,
        })
      });
      var firstValues = [
        document.getElementById('filter__years-start'),
        document.getElementById('filter__years-end')
      ];
      (<any>firstSlider).noUiSlider.on('update', function (values, handle) {
        firstValues[handle].innerHTML = values[handle];
      });
    } else {
      return false;
    }
    return false;
  }
  private initializeSecondSlider() {
    if ($('#filter__views').length) {
      var secondSlider = document.getElementById('filter__views');
      noUiSlider.create(secondSlider, {
        range: {
          'min': 0,
          'max': 900
        },
        step: 1,
        connect: true,
        start: [0, 900],
        format: wNumb({
          decimals: 0,
        })
      });

      var secondValues = [
        document.getElementById('filter__views-start'),
        document.getElementById('filter__views-end')
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
  private initializeThirdSlider() {
    if ($('#slider__rating').length) {
      var thirdSlider = document.getElementById('slider__rating');
      noUiSlider.create(thirdSlider, {
        range: {
          'min': 0,
          'max': 10
        },
        connect: [true, false],
        step: 0.1,
        start: 8.6,
        format: wNumb({
          decimals: 1,
        })
      });

      var thirdValue = document.getElementById('form__slider-value');

      (<any>thirdSlider).noUiSlider.on('update', function (values, handle) {
        thirdValue.innerHTML = values[handle];
      });
    } else {
      return false;
    }
    return false;
  }
}
