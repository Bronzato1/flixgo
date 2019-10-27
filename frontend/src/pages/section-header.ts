export class SectionHeader {
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

    $('.header__search-btn').on('click', function() {
      $(this).toggleClass('active');
      $('.header__search').toggleClass('header__search--active');
  
      if ($('.header__btn').hasClass('header__btn--active')) {
        $('.header__btn').toggleClass('header__btn--active');
        $('.header__nav').toggleClass('header__nav--active');
        $('.body').toggleClass('body--active');
      }
    });
  }
}
