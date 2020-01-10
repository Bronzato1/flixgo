import {Aurelia} from 'aurelia-framework'
import environment from './environment';

import 'nouislider/nouislider.css';

// Bootstrap
//import 'bootstrap/css/bootstrap.css';
import 'bootstrap';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-validation')
    .feature('resources')
    .globalResources([
      'resources/elements/scriptinjector'
  ]);

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  return aurelia.start().then(() => aurelia.setRoot());
}
