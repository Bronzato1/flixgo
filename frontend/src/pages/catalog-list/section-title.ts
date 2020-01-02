import { ViewModelBase } from "base/view-model-base";

export class SectionTitle extends ViewModelBase {
  private searchTerms: string;
  private bind(bindingContext) {
    this.searchTerms = bindingContext.searchTerms;
  }
}
