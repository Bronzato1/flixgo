import { YoutubeVideo } from './../../models/youtube-video-model';
import { Preferences } from 'preferences';
import { YoutubeGateway } from 'gateways/youtube-gateway';
import { TaskQueue, autoinject } from 'aurelia-framework';

@autoinject()
export class SectionContent {

    constructor(youtubeGateway: YoutubeGateway, taskQueue: TaskQueue) {
        this.youtubeGateway = youtubeGateway;
        this.taskQueue = taskQueue;
    }

    youtubeGateway: YoutubeGateway;
    taskQueue: TaskQueue;
    videos2d: YoutubeVideo[] = []; // 2d array
    hashtags: string[] = Preferences.Hashtags;
    nextPageToken: string[] = [];
    videosLoaded: boolean = false;

    created() {

        var promises = [];

        Preferences.Hashtags.forEach((hashtag, i) => {
            let videos = JSON.parse(localStorage.getItem(hashtag));
            if (videos) {
                this.videos2d[i] = videos;
            } else {
                var promise = this.youtubeGateway.search_list(hashtag)
                    .then((data) => {
                        localStorage.setItem(hashtag, JSON.stringify(data.items));
                        this.videos2d[i] = data.items;
                        this.nextPageToken[i] = data.nextPageToken;
                    });
                promises.push(promise);
            }
        });

        Promise.all(promises).then(() =>
            this.videosLoaded = true
        );
    }
}
