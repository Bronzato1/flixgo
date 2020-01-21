export class Edituser {

    constructor() {
    }

    userId: number;

    activate(params) {
        this.userId = params.id;
    }
}