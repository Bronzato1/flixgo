import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';

export class SectionHome {
  attached() {
    this.initializeCarousel();
    window.setTimeout(this.triggerResize, 500);
  }
  private initializeCarousel() {

    $('.home__bg').owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      mouseDrag: false,
      touchDrag: false,
      items: 1,
      dots: false,
      loop: true,
      autoplay: false,
      smartSpeed: 600,
      margin: 0,
    });

    $('.home__bg .item').each(function () {
      if ($(this).attr("data-bg")) {
        $(this).css({
          'background': 'url(' + $(this).data('bg') + ')',
          'background-position': 'center center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
        });
      }
    });

    $('.home__carousel').owlCarousel({
      mouseDrag: false,
      touchDrag: false,
      dots: false,
      loop: true,
      autoplay: false,
      smartSpeed: 600,
      margin: 30,
      responsive: {
        0: {
          items: 2,
        },
        576: {
          items: 2,
        },
        768: {
          items: 3,
        },
        992: {
          items: 4,
        },
        1200: {
          items: 4,
          margin: 50
        },
      }
    });

    $('.home__nav--next').on('click', function () {
      $('.home__carousel, .home__bg').trigger('next.owl.carousel');
    });
    $('.home__nav--prev').on('click', function () {
      $('.home__carousel, .home__bg').trigger('prev.owl.carousel');
    });

    $(window).on('resize', function () {
      var itemHeight = $('.home__bg').height();
      $('.home__bg .item').css("height", itemHeight + "px");
    });
  }
  private triggerResize() {
    // Pas sur que ce soit vraiment utile.
    $(window).trigger('resize');
  }
}
