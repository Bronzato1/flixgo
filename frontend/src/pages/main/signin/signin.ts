import { Router } from 'aurelia-router';
import { ViewModelBase } from 'base/view-model-base';
import { autoinject, Aurelia } from 'aurelia-framework';
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";
import { AuthenticationGateway } from 'gateways/authentication-gateway';

@autoinject()
export class Signin extends ViewModelBase {

    constructor(aurelia: Aurelia, router: Router, validationController: ValidationControllerFactory, authenticationGateway: AuthenticationGateway) {
        super();
        this.aurelia = aurelia;
        this.router = router;
        this.validationController = validationController.createForCurrentScope();
        this.authenticationGateway = authenticationGateway;
    }

    aurelia: Aurelia;
    router: Router;
    validationController: ValidationController;
    authenticationGateway: AuthenticationGateway;
    username: string;
    password: string;

    activate() {
        this.manageValidationRules();
    }
    attached() {
        super.attached();
    }
    manageValidationRules() {
        ValidationRules
            .ensure((x: Signin) => x.username).required()
            .ensure((x: Signin) => x.password).required()
            .on(this);

        this.validationController.addObject(this);
    }
    signIn() {
        this.validationController
            .validate()
            .then((result) => {
                if (result.valid) {
                    this.authenticationGateway.login(this.username, this.password)
                }
            });
    }
}