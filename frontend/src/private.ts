import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { autoinject, Aurelia } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { DOM, Dom } from 'aurelia-pal'

@autoinject()
export class Private {

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
    this.httpClient.fetch('./src/css/admin.css')
      .then((data) => data.text())
      .then((styles) => {
        DOM.injectStyles(styles, null, null, 'masterStylesheet');
        this.masterStyleSheetLoaded = true;
      });
  }
  configureRouter(config: RouterConfiguration) {
    config.title = 'FlixGo';
    config.map([
      { route: '', redirect: 'index' },
      { route: 'index', name: 'index', moduleId: './pages/admin/home/index', title: 'Index' },
      { route: 'catalog', name: 'catalog', moduleId: './pages/admin/catalog/catalog', title: 'Catalog' },
      { route: 'user', name: 'user', moduleId: './pages/admin/user/user', title: 'Users' },
      { route: 'comment', name: 'comment', moduleId: './pages/admin/comment/comment', title: 'Comments' },
      { route: 'review', name: 'review', moduleId: './pages/admin/review/review', title: 'Reviews' },
      { route: 'addItem', name: 'addItem', moduleId: './pages/admin/add-item/add-item', title: 'Add item' },
      { route: 'editUser', name: 'editUser', moduleId: './pages/admin/edit-user/edit-user', title: 'Edit user' },
      { route: 'notFound', name: 'notFound', moduleId: './pages/admin/not-found/not-found', title: 'Not found' }
    ]);
    config.mapUnknownRoutes('./pages/admin/not-found/not-found');
  }
  attached() {
    this.initializeScripts():
  }
  initializeScripts() {

    //==============================
    // Filter
    //==============================
    $('.filter__item-menu li').each(function () {
      $(this).attr('data-value', $(this).text().toLowerCase());
    });

    $(document).on('click', '.filter__item-menu li', function () {
      var text = $(this).text();
      var item = $(this);
      var id = item.closest('.filter').attr('id');
      $('#' + id).find('.filter__item-btn input').val(text);
    });
  }
}
