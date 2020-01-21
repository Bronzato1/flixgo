import { autoinject, bindable, bindingMode, customAttribute, observable } from "aurelia-framework";
import 'select2.min';

@customAttribute("select2")
@autoinject()
export class Select2Attribute {

    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    @bindable({ defaultBindingMode: bindingMode.oneTime }) allowClear: boolean = false;

    private select: any;
    private element: Element;

    constructor(element: Element) {
        this.element = element;
    }

    attached() {
        let clear = ((this.allowClear as any) === "true");
        if (this.select) {
            return;
        }
        this.select = (<any>$(this.element))
            .select2({ allowClear: clear, placeholder: "Select an option..." });

        this.select.on("change", (event: JQueryEventObject, options: any) => {
            if (event.originalEvent) {
                return;
            }
            if (this.value != (<any>(event.target)).value) {
                this.value = ((<any>event.target)).value;
            }
        });
    }

    valueChanged(newVal, oldVal) {
        if (this.select)
            this.select.trigger("change");
    }

    detached() {
        if (this.select) {
            this.select.off("change");
            this.select.select2("destroy");
        }
        this.select = null;
    }
}