import { autoinject } from 'aurelia-framework';
import { YoutubeGateway } from 'gateways/youtube-gateway';
import { Preferences } from 'preferences';
import { YoutubeChannel } from 'models/youtube-channel-model';
import { ViewModelBase } from "base/view-model-base";
import { bind } from 'bluebird';

@autoinject()
export class SectionTitle extends ViewModelBase {

  constructor(youtubeGateway: YoutubeGateway) {
    super();
    this.youtubeGateway = youtubeGateway;
  }

  channelId: string;
  channelTitle: string;
  channelVideoCount: number;
  youtubeGateway: YoutubeGateway;

  created(bindingContext) {
    this.channelId = bindingContext.container.viewModel.channelId;
    this.youtubeGateway.channels_list_byId(this.channelId).then((data: YoutubeChannel) => {
      this.channelTitle = data.snippet.title;
      this.channelVideoCount = data.statistics.videoCount;
    });
  }
}
