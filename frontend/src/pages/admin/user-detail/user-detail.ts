export class userDetail {

    constructor() {
    }

    userId: number;

    activate(params) {
        this.userId = params.id || null;
    }
}