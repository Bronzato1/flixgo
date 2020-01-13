import { ViewModelBase } from "base/view-model-base";

export class SectionTitle extends ViewModelBase {
  
  channelId: string;
  created(bindingContext) {
    this.channelId = bindingContext.container.viewModel.channelId;

  }
}
