import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { YoutubeChannel } from 'models/youtube-channel-model';
import { YoutubeChannels } from 'youtube-channels';
import { YoutubeGateway } from 'gateways/youtube-gateway';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';

@autoinject()
export class SectionHome {

  constructor(router: Router, youtubeGateway: YoutubeGateway) {
    this.router = router;
    this.youtubeGateway = youtubeGateway;
  }

  router: Router;
  youtubeGateway: YoutubeGateway;
  channels: any; //YoutubeChannel[];

  bind() {
  }
  attached() {
    let ids = YoutubeChannels.Ids;
    this.youtubeGateway.channels_list_byIds(ids).then(data => {
      this.channels = data;
      window.setTimeout(this.initializeCarousel, 100);
      window.setTimeout(this.triggerResize, 500);
    });
  }
  initializeCarousel() {

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
  triggerResize() {
    // Pas sur que ce soit vraiment utile.
    $(window).trigger('resize');
  }
  nFormatter(num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + ' ' + si[i].symbol;
  }
  showCatalogList(channelId) {
    this.router.navigateToRoute('catalogList', { channelId: channelId });
  }
}
