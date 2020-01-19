import { Router } from 'aurelia-router';
import { autoinject, Aurelia } from 'aurelia-framework';

@autoinject()
export class Index {

  constructor(aurelia: Aurelia, router: Router) {
    this.aurelia = aurelia;
    this.router = router;
  }

  aurelia: Aurelia;
  router: Router;
}