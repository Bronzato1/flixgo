/// <reference path="../../../global.d.ts" />

import 'select2.min';
import 'jquery.magnific-popup.min';

export class SectionMainContent {

    constructor() {

    }

    attached() {
        (<any>$('#subscription, #rights')).select2();
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
}