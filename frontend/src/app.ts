import { Router, RouterConfiguration, Redirect } from 'aurelia-router';

export class App {
  configureRouter(config: RouterConfiguration) {
    config.addPostRenderStep(PostRenderStep);
    config.title = 'FlixGo';
    config.map([
      { route: '', redirect: 'index' },
      { route: 'index', name: 'index', moduleId: './pages/home/index', title: 'Index' },
      { route: 'catalogGrid', name: 'catalogGrid', moduleId: './pages/catalog-grid/catalog', title: 'Catalog grid' },
      { route: 'catalogList', name: 'catalogList', moduleId: './pages/catalog-list/catalog', title: 'Catalog list' },
      { route: 'detail1/:videoId', name: 'detail1', moduleId: './pages/detail/detail1', title: 'Detail 1' },
      { route: 'detail2', name: 'detail2', moduleId: './pages/detail/detail2', title: 'Detail 2' },
      { route: 'pricing', name: 'pricing', moduleId: './pages/pricing/pricing', title: 'Pricing' },
      { route: 'faq', name: 'faq', moduleId: './pages/help/faq', title: 'Faq' },
      { route: 'about', name: 'about', moduleId: './pages/about/about', title: 'About' },
      { route: 'profile', name: 'profile', moduleId: './pages/profile/profile', title: 'Profile' },
      { route: 'signin', name: 'signin', moduleId: './pages/signin/signin', title: 'Signin' },
      { route: 'signup', name: 'signup', moduleId: './pages/signup/signup', title: 'Signup' },
      { route: 'notFound', name: 'notFound', moduleId: './pages/not-found/not-found', title: 'Not found' }
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

    });
  }
}

class PostRenderStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.router.isNavigatingNew) {
      window.scroll(0, 0);
    }
    return next();
  }
}
