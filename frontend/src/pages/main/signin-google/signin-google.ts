import { Router } from 'aurelia-router';
import { autoinject, Aurelia } from 'aurelia-framework';
import { YoutubeGateway } from '../../../gateways/youtube-gateway';
import { ViewModelBase } from 'base/view-model-base';
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";

@autoinject()
export class SigninGoogle extends ViewModelBase {

  constructor(aurelia: Aurelia, router: Router, youtubeGateway: YoutubeGateway, validationController: ValidationControllerFactory) {
    super();
    this.aurelia = aurelia;
    this.router = router;
    this.youtubeGateway = youtubeGateway;
    this.validationController = validationController.createForCurrentScope();
  }

  aurelia: Aurelia;
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
        if (result.valid) {
          // Ci-dessous, le code pour s'authentifier à travers Google sign-in
          this.youtubeGateway.signIn().then(() => {
            this.router.navigate('index');
          });
        }
      });
  }
  manageValidationRules() {
    ValidationRules
      .ensure((x: SigninGoogle) => x.privacyCheckbox).required()
      .ensure((x: SigninGoogle) => x.termsofuseCheckbox).required()
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