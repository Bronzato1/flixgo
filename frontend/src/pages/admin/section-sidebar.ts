import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { AuthenticationGateway } from 'gateways/authentication-gateway';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'malihu-custom-scrollbar-plugin';
import 'jquery.mousewheel';

@autoinject()
export class SectionSidebar {

    constructor(authenticationGateway: AuthenticationGateway, router: Router) {
        this.authenticationGateway = authenticationGateway;
        this.router = router;
    }

    authenticationGateway: AuthenticationGateway;
    router: Router;

    attached() {
        this.initializeCustomScrollbar();
    }
    initializeCustomScrollbar() {
        (<any>$('.scrollbar-dropdown')).mCustomScrollbar({
            axis: "y",
            scrollbarPosition: "outside",
            theme: "custom-bar"
        });

        (<any>$('.main__table-wrap')).mCustomScrollbar({
            axis: "x",
            scrollbarPosition: "outside",
            theme: "custom-bar2",
            advanced: {
                autoExpandHorizontalScroll: true
            }
        });

        (<any>$('.dashbox__table-wrap')).mCustomScrollbar({
            axis: "x",
            scrollbarPosition: "outside",
            theme: "custom-bar3",
            advanced: {
                autoExpandHorizontalScroll: 2
            }
        });

    }
    logout() {
        this.authenticationGateway.logout();
    }
    currentRouteIs(route) {
        return this.router.currentInstruction.config.route == route;
    }
}