export class SectionTitle {
  private searchTerms: string;
  private bind(bindingContext) {
    this.searchTerms = bindingContext.searchTerms;
  }
}
