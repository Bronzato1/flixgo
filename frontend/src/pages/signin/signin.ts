import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { YoutubeGateway } from './../../gateways/youtube-gateway';
import { ViewModelBase } from 'base/view-model-base';
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";

@autoinject()
export class Signin extends ViewModelBase {

  constructor(router: Router, youtubeGateway: YoutubeGateway, validationController: ValidationControllerFactory) {
    super();
    this.router = router;
    this.youtubeGateway = youtubeGateway;
    this.validationController = validationController.createForCurrentScope();
  }

  router: Router;
  youtubeGateway: YoutubeGateway;
  privacyCheckbox: boolean;
  termsofuseCheckbox: boolean;
  validationController: ValidationController;

  activate() {
    this.manageValidationRules();
  }
  attached() {
    super.attached();
  }
  signIn() {
    this.validationController
      .validate()
      .then((result) => {
        if (result.valid)
          this.youtubeGateway.signIn().then(() => {
            this.router.navigate('index');
          });
      });

  }
  manageValidationRules() {
    ValidationRules
      .ensure((x: Signin) => x.privacyCheckbox).required()
      .ensure((x: Signin) => x.termsofuseCheckbox).required()
      .on(this);

    this.validationController.addObject(this);
  }
  execute() {
    return (<any>window).gapi.client.youtube.channels.list({
      "part": "snippet,contentDetails,statistics",
      "mine": true
    })
      .then(function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
        function (err) { console.error("Execute error", err); });
  }
}

