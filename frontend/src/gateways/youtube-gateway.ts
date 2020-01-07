import { Youtube } from './../models/youtube-model';
import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from "aurelia-framework";
import environment from 'environment';
import secret from '../secret';

@autoinject()
export class YoutubeGateway {

  constructor() {
    debugger;
    this.httpClient = new HttpClient();
    gapiReady.then(() => {
      this.gapi = (<any>window).gapi;
      this.initAuth2();
    });
  }
  
  httpClient: HttpClient;
  gapi;
  auth2;
  
  initAuth2() {
    this.gapi.load("client:auth2", () => {
      this.auth2 = this.gapi.auth2.init({ client_id: secret.googleClientId });
      this.auth2.attachClickHandler('signin-button', {}, onSuccess, onFailure);
      this.auth2.isSignedIn.listen(signInChanged);
      this.auth2.currentUser.listen(userChanged);
      monkeyPatch();
    });

    var signInChanged = function (val) {
      console.log('Signin state changed to ', val);
    };
    var userChanged = function (user) {
      if (user.getId()) {
        // Do something here
      }
    };
    var onSuccess = function (user) {
      console.log('Signed in as ' + user.getBasicProfile().getName());
      // Redirect somewhere
    };
    var onFailure = function (error) {
      console.log(error);
    };

    function monkeyPatch() {
      // monkey patch >> https://stackoverflow.com/questions/43040405/loading-aurelia-breaks-google-api
      const originTest = RegExp.prototype.test;
      RegExp.prototype.test = function test(v: any) {
        if (typeof v === 'function' && v.toString().includes('__array_observer__.addChangeRecord')) {
          return true;
        }
        return originTest.apply(this, arguments);
      };
    }

  }
  authenticate() {
    return (<any>window).gapi.auth2.getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(() => {
        console.log("Sign-in successful");
      },
        (err) => {
          console.error("Error signing in", err);
          return Promise.reject(err);
        });
  }
  loadClient() {
    (<any>window).gapi.client.setApiKey(secret.googleApiKey);
    return (<any>window).gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(() => { console.log("GAPI client loaded for API"); },
        (err) => { console.error("Error loading GAPI client for API", err); });
  }
  signIn(): Promise<boolean> {
    return this.authenticate().then(this.loadClient).then(() => {
      console.log('Successfully connected');
      return Promise.resolve(true);
    }).catch(err => {
      debugger;
    });
  }
  signOut() {
    this.auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  get isSignedIn() {
    if (!this.gapi) return false;
    if (!this.auth2) return false;
    return this.auth2.isSignedIn.get();
  }
  searchVideos(searchTerms: string, pageToken: string = null) {
    debugger;
    var url = `${environment.youtubeUrl}search?part=snippet&type=video&videoType=movie&maxResults=50&q=${searchTerms}&key=${secret.googleApiKey}`;

    if (pageToken)
      url += `&pageToken=${pageToken}`;

    return this.httpClient
      .fetch(url)
      .then(response => response.json())
      .then(data => {
        var result1: Youtube[] = data.items.map(Youtube.fromSearch);
        var ids = data.items.map(x => x.id.videoId);

        return this.videoStatistics(ids).then(items => {
          var result2: Youtube[] = items.map(Youtube.fromStatistics);
          var merged: Youtube[] = [];

          for (var i = 0; i < result1.length; i++) {
            var obj = { ...result1[i], ...result2[i] };
            merged.push(obj);
          }

          return {
            nextPageToken: data.nextPageToken,
            totalItems: data.nextPageToken ? 999 : merged.length,
            items: merged
          };
        });
      })
      .catch(error => console.log(error));
  }
  searchMoviesByPlaylist(playlistId: string, pageToken: string = null): Promise<any> {

    var url = `${environment.youtubeUrl}playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistId}&key=${secret.googleApiKey}`;

    if (pageToken)
      url += `&pageToken=${pageToken}`;

    return this.httpClient
      .fetch(url)
      .then(response => response.json())
      .then(data => {
        var result1: Youtube[] = data.items.map(Youtube.fromSearch);
        var ids = result1.map(x => x.contentDetails.videoId);

        return this.videoStatistics(ids).then(items => {
          var result2: Youtube[] = items.map(Youtube.fromStatistics);
          var merged: Youtube[] = [];

          for (var i = 0; i < result1.length; i++) {
            var obj = { ...result1[i], ...result2[i] };
            merged.push(obj);
          }

          return {
            nextPageToken: data.nextPageToken,
            totalItems: data.nextPageToken ? 999 : merged.length,
            items: merged
          };
        });
      })
      .catch(error => console.log(error));
  }
  videoStatistics(ids): Promise<any> {
    return this.httpClient
      .fetch(`${environment.youtubeUrl}videos?part=statistics&id=${ids}&key=${secret.googleApiKey}`)
      .then(response => response.json())
      .then(data => data.items)
      .catch(error => console.log(error));
  }
  searchMovieByVideoId(videoId: string): Promise<void | Youtube> {

    var url = `${environment.youtubeUrl}videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${secret.googleApiKey}`;

    return this.httpClient
      .fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.items.length == 1) {
          var result: Youtube = Youtube.fromSearch(data.items[0]);
          result.contentDetails.videoId = videoId;
          return Promise.resolve(result);
        }
      })
      .catch(error => console.log(error));
  }
  searchAllMoviesByPlaylist(playlistId: string, pageToken: string): Promise<any> {

    var self = this;
    var allItems: Array<Youtube> = [];

    function getData(pageToken) {
      return self.searchMoviesByPlaylist(playlistId, pageToken).then(data => {
        allItems = allItems.concat(data.items);
        if (data.nextPageToken)
          return getData(data.nextPageToken);
        else {
          return Promise.resolve(allItems);
        }
      }).catch(error => {
        debugger;
      });
    }

    return getData(pageToken);
  }
  channelsList() {
    debugger;
    return (<any>window).gapi.client.youtube.channels.list({
      "part": "snippet,contentDetails,statistics",
      "mine": true
    })
      .then(function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
        function (err) { console.error("Execute error", err); });
  }
}

function prepareGapi() {
  // https://stackoverflow.com/questions/41456403/aurelia-google-signin-button

  // The name of the global function the platform API will call when it's ready.
  const apiCallbackName = 'setGoogleApiReady';

  // An "API ready" promise that will be resolved when the platform API is ready.
  const ready = new Promise(resolve => window[apiCallbackName] = resolve);

  // Inject an async script element to load the google platform API.
  // Notice the callback name is passed as an argument on the query string.
  const script = document.createElement('script');
  script.src = `https://apis.google.com/js/api.js?onload=${apiCallbackName}`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  return ready;
}

const gapiReady = prepareGapi();
