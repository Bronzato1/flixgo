import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { YoutubeGateway } from './../../gateways/youtube-gateway';
import { ViewModelBase } from 'base/view-model-base';
import secret from 'secret';

@autoinject()
export class Signin extends ViewModelBase {

  constructor(router: Router, youtubeGateway: YoutubeGateway) {
    super();
    this.router = router;
    this.youtubeGateway = youtubeGateway;
  }

  router: Router;
  youtubeGateway: YoutubeGateway;
  privacyCheckbox: boolean;
  termsofuseCheckbox: boolean;

  attached() {
    super.attached();
  }
  signIn() {
    this.youtubeGateway.signIn().then(() => {
      this.router.navigate('index');
    });
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

