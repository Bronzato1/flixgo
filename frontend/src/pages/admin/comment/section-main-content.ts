/// <reference path="../../../global.d.ts" />

import 'jquery.magnific-popup.min';

export class SectionMainContent {

    constructor() {

    }

    attached() {
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