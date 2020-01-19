import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { autoinject, Aurelia } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { DOM, Dom } from 'aurelia-pal'

@autoinject()
export class Public {

  constructor(aurelia: Aurelia, router: Router) {
    this.httpClient = new HttpClient();
    this.aurelia = aurelia;
    this.router = router;
  }

  httpClient: HttpClient;
  aurelia: Aurelia;
  router: Router;
  masterStyleSheetLoaded: boolean;

  created() {
    this.masterStyleSheetLoaded = false;
    this.httpClient.fetch('./src/css/main.css')
      .then((data) => data.text())
      .then((styles) => {
        DOM.injectStyles(styles, null, null, 'masterStylesheet');
        this.masterStyleSheetLoaded = true;
      });
  }
  configureRouter(config: RouterConfiguration) {
    //debugger;
    config.addPostRenderStep(PostRenderStep);
    config.title = 'FlixGo';
    config.map([
      { route: '', redirect: 'index' },
      { route: 'index', name: 'index', moduleId: './pages/main/home/index', title: 'Index' },
      { route: 'catalogGrid', name: 'catalogGrid', moduleId: './pages/main/catalog-grid/catalog', title: 'Catalog grid' },
      { route: 'catalogList', name: 'catalogList', moduleId: './pages/main/catalog-list/catalog', title: 'Catalog list' },
      { route: 'detail1/:videoId', name: 'detail1', moduleId: './pages/main/detail/detail1', title: 'Detail 1' },
      { route: 'detail2', name: 'detail2', moduleId: './pages/main/detail/detail2', title: 'Detail 2' },
      { route: 'pricing', name: 'pricing', moduleId: './pages/main/pricing/pricing', title: 'Pricing' },
      { route: 'faq', name: 'faq', moduleId: './pages/main/help/faq', title: 'Faq' },
      { route: 'about', name: 'about', moduleId: './pages/main/about/about', title: 'About' },
      { route: 'profile', name: 'profile', moduleId: './pages/main/profile/profile', title: 'Profile' },
      { route: 'signin', name: 'signin', moduleId: './pages/main/signin/signin', title: 'Signin' },
      { route: 'signup', name: 'signup', moduleId: './pages/main/signup/signup', title: 'Signup' },
      { route: 'privacy', name: 'privacy', moduleId: './pages/main/privacy/privacy', title: 'Privacy' },
      { route: 'termsofuse', name: 'termsofuse', moduleId: './pages/main/terms-of-use/terms-of-use', title: 'Terms of use' },
      { route: 'notFound', name: 'notFound', moduleId: './pages/main/not-found/not-found', title: 'Not found' }
    ]);
    config.mapUnknownRoutes('./pages/main/not-found/not-found');
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
  // signIn() {
  //   debugger;
  // }
}

class PostRenderStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.router.isNavigatingNew) {
      window.scroll(0, 0);
    }
    return next();
  }
}
