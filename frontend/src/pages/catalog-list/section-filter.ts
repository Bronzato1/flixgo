import { YoutubeGateway } from './../../gateways/youtube-gateway';
import { IFilter } from './../../interfaces/filter-interface';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine, bindable, observable, Disposable, autoinject } from 'aurelia-framework';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'malihu-custom-scrollbar-plugin';
import 'jquery.mousewheel';
import { YoutubePlaylist } from 'models/youtube-playlist-model';

@autoinject()
export class SectionFilter {

  constructor(bindingEngine: BindingEngine, eventAgregator: EventAggregator, youtubeGateway: YoutubeGateway) {
    this.be = bindingEngine;
    this.ea = eventAgregator;
    this.youtubeGateway = youtubeGateway;
  }

  be: BindingEngine;
  ea: EventAggregator;
  subscription: Subscription;
  disposables: Disposable[] = [];
  observers: MutationObserver[] = [];
  youtubeGateway: YoutubeGateway;
  playlists: YoutubePlaylist[];
  filters: IFilter = {};
  channelId: string;

  created() {
  }
  bind(bindingContext) {
    this.channelId = bindingContext.channelId;

    this.propertyObserverSubscription();
    this.eventAggregatorSubscription();

    this.loadPlaylists().then(() => {
      this.prepareFilters();
      this.resetFilters();
      this.restoreFilters();
      this.filtersChanged();
    });

  }
  unbind() {
    this.propertyOberverUnsubscription();
    this.eventAggregatorUnsubscription();
  }
  attached() {
      this.startObserveDOM();
  }
  detached() {
    this.stopObserveDOM();
  }
  loadPlaylists() {
    return this.youtubeGateway.playlists_list(this.channelId).then(data => {
      this.playlists = data || null;
      this.playlists.forEach(playlist => $('#ul-filter-date').append(`<li>${playlist.snippet.title}</li>`));
      return Promise.resolve(true);
    });
  }
  startObserveDOM() {
    this.observeDOM('playlistText');
    this.observeDOM('pageSizeText');
    this.observeDOM('sortOrderText');
    this.observeDOM('releaseYearStart');
    this.observeDOM('releaseYearEnd');
  }
  stopObserveDOM() {
    // à l'origine de MutationObserver
    this.observers.forEach(x => x.disconnect());
  }
  prepareFilters() {
    // Scrollbars sur les listes de filtres
    (<any>$('.scrollbar-dropdown')).mCustomScrollbar({
      axis: "y",
      scrollbarPosition: "outside",
      theme: "custom-bar"
    });
    // Conversion en minuscule sur les textes des listes de filtres
    $('.filter__item-menu li').each(function () {
      $(this).attr('data-value', $(this).text().toLowerCase());
    });
    // Affichage du filtre sélectionné au clic
    $('.filter__item-menu li').on('click', function () {
      var text = $(this).text();
      var item = $(this);
      var id = item.closest('.filter__item').attr('id');
      $('#' + id).find('.filter__item-btn input').val(text);
    });
  }
  restoreFilters() {
    // Après être passé dans la page détail d'un film, on restore les filtres 
    if (JSON.parse(sessionStorage.getItem('filters'))) {
      this.filters = JSON.parse(sessionStorage.getItem('filters'));
      sessionStorage.removeItem('filters');
    }
  }
  resetFilters() {
    this.filters.searchTerms = null;

    this.filters.playlistText = this.playlists[0].snippet.title;
    this.filters.playlistValue = this.playlists[0].id;

    this.filters.pageSizeText = '10 éléments';
    this.filters.pageSizeValue = 10;

    this.filters.sortOrderText = 'Pertinence';
    this.filters.sortOrderValue = null;

    this.filters.releaseYearStart = 2000;
    this.filters.releaseYearEnd = 2020;
  }
  propertyObserverSubscription() {
    this.disposables.push(this.be.propertyObserver(this.filters, 'searchTerms').subscribe(() => { this.searchTermsChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'pageSizeText').subscribe(() => { this.pageSizeTextChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'sortOrderText').subscribe(() => { this.sortOrderTextChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'playlistText').subscribe(() => { this.playlistTextChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'releaseYearStart').subscribe(() => { this.releaseYearStartChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'releaseYearEnd').subscribe(() => { this.releaseYearEndChanged(); }));
  }
  propertyOberverUnsubscription() {
    // à l'origine des BindingEngine
    this.disposables.forEach(x => x.dispose());
  }
  eventAggregatorSubscription() {
    this.subscription = this.ea.subscribe('filtering', (response: IFilter) => {
      this.filters = response;
    });
  }
  eventAggregatorUnsubscription() {
    // à l'origine de EventAggregator
    this.subscription.dispose();
  }
  resetSearchTerms() {
    this.filters.searchTerms = null;
  }
  observeDOM(elm) {
    // Selectionne le noeud dont les mutations seront observées
    var targetNode = document.getElementById(elm);
    // Options de l'observateur (quelles sont les mutations à observer)
    var config = { attributes: true, childList: true };
    // Créé une instance de l'observateur lié à la fonction de callback
    var mutationObserver = new MutationObserver(callback);
    this.observers.push(mutationObserver);
    // Commence à observer le noeud cible pour les mutations précédemment configurées
    mutationObserver.observe(targetNode, config);
    var self = this;
    // Fonction callback à éxécuter quand une mutation est observée
    function callback() {
      let value = ($('#' + elm).is('input')) ? $('#' + elm).val() : $('#' + elm).text();
      if (self.filters[elm])
        self.filters[elm] = value;
      else
        self[elm] = value;
    }
  }
  get showResetFiltersButton() {
    return true;
  }
  searchTermsChanged() {
    this.filtersChanged();
  }
  pageSizeTextChanged() {
    var nbr: number = +this.filters.pageSizeText.substr(0, 2);
    this.filters.pageSizeValue = nbr;
    this.filtersChanged();
  }
  sortOrderTextChanged() {
    switch (this.filters.sortOrderText) {
      case 'Pertinence':
        this.filters.sortOrderValue = '';
        break;
      case 'Titre du film':
        this.filters.sortOrderValue = 'title'
        break;
      case 'Mise en ligne':
        this.filters.sortOrderValue = 'videoPublishedAt';
        break;
      case 'Nombre de com':
        this.filters.sortOrderValue = 'commentCount';
        break;
      case 'Nombre de likes':
        this.filters.sortOrderValue = 'likeCount';
        break;
    }
    this.filtersChanged();
  }
  playlistTextChanged() {
    var data: IFilter = {};
    var playlist = this.playlists.find(x => x.snippet.title == this.filters.playlistText);

    if (playlist)
      this.filters.playlistValue = playlist.id;
    else
      debugger;

    this.filtersChanged();
  }
  releaseYearStartChanged() {
    this.filtersChanged();
  }
  releaseYearEndChanged() {
    this.filtersChanged();
  }
  filtersChanged() {
    if (this.ea) this.ea.publish('filtering', this.filters);
  }
}
