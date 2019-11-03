import { Router, RouterConfiguration, Redirect } from 'aurelia-router';

export class App {
  configureRouter(config: RouterConfiguration) {
    config.title = 'FlixGo';
    config.map([
      { route: '', redirect: 'index' },
      { route: 'index', name: 'index', moduleId: './pages/home/index', title: 'Index' },
      { route: 'catalogGrid', name: 'catalogGrid', moduleId: './pages/catalog-grid/catalog', title: 'Catalog grid' },
      { route: 'catalogList', name: 'catalogList', moduleId: './pages/catalog-list/catalog', title: 'Catalog list' },
      { route: 'post1', name: 'post1', moduleId: './pages/post/post1', title: 'Post 1' },
      { route: 'post2', name: 'post2', moduleId: './pages/post/post2', title: 'Post 2' }
    ]);
    config.mapUnknownRoutes('./pages/not-found/not-found');
  }
  attached() {
    $(document).ready(function () {

      /*==============================
        Tabs
        ==============================*/
      $('.content__mobile-tabs-menu li').each(function () {
        $(this).attr('data-value', $(this).text().toLowerCase());
      });

      $('.content__mobile-tabs-menu li').on('click', function () {
        var text = $(this).text();
        var item = $(this);
        var id = item.closest('.content__mobile-tabs').attr('id');
        $('#' + id).find('.content__mobile-tabs-btn input').val(text);
      });

      /*==============================
      Section bg
      ==============================*/
      $('.section--bg, .details__bg').each(function () {
        if ($(this).attr("data-bg")) {
          $(this).css({
            'background': 'url(' + $(this).data('bg') + ')',
            'background-position': 'center center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover'
          });
        }
      });

      /*==============================
      Filter
      ==============================*/
      $('.filter__item-menu li').each(function () {
        $(this).attr('data-value', $(this).text().toLowerCase());
      });

      $('.filter__item-menu li').on('click', function () {
        var text = $(this).text();
        var item = $(this);
        var id = item.closest('.filter__item').attr('id');
        $('#' + id).find('.filter__item-btn input').val(text);
      });
    });
  }
}
