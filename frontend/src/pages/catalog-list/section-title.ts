import { YoutubeChannels } from 'youtube-channels';
import { YoutubeChannel } from 'models/youtube-channel-model';
import { ViewModelBase } from "base/view-model-base";

export class SectionTitle extends ViewModelBase {
  
  channelId: string; // of the channel
  channelTitle: string;
  channelHashtags: string[];

  created(bindingContext) {
    this.channelId = bindingContext.container.viewModel.channelId;
    this.channelTitle = YoutubeChannels.Items.find(x => x.id == this.channelId).title;
    this.channelHashtags = YoutubeChannels.Items.find(x => x.id == this.channelId).hashtags;
  }
}
