import 'select2.min';

export class SectionMainContent {

    constructor() {

    }

    attached() {
        (<any>$('#quality')).select2({
            placeholder: "Choose quality",
            allowClear: true
        });
    
        (<any>$('#country')).select2({
            placeholder: "Choose country / countries"
        });
    
        (<any>$('#genre')).select2({
            placeholder: "Choose genre / genres"
        });
    }
}