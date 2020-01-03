import { IFilter } from './../../interfaces/filter-interface';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine, bindable, observable, Disposable, autoinject } from 'aurelia-framework';
import { Playlists } from 'playlists';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'malihu-custom-scrollbar-plugin';
import 'jquery.mousewheel';

@autoinject()
export class SectionFilter {
  constructor(bindingEngine: BindingEngine, eventAgregator: EventAggregator) {
    this.be = bindingEngine;
    this.ea = eventAgregator;
  }
  private be: BindingEngine;
  private ea: EventAggregator;
  private subscription: Subscription;
  private disposables: Disposable[] = [];
  private observers: MutationObserver[] = [];
  private filters: IFilter = {};
  private bind() {
    this.resetFilters();
    this.restoreFilters();
    this.propertyObserverSubscription();
    this.eventAggregatorSubscription();
  }
  private unbind() {
    this.propertyOberverUnsubscription();
    this.eventAggregatorUnsubscription();
  }
  private attached() {
    this.startObserveDOM();
    this.prepareFilters();
    this.filtersChanged();
  }
  private detached() {
    this.stopObserveDOM();
  }
  private restoreFilters() {
    // Après être passé dans la page détail d'un film, on restore les filtres 
    if (JSON.parse(sessionStorage.getItem('filters'))) {
      this.filters = JSON.parse(sessionStorage.getItem('filters'));
      sessionStorage.removeItem('filters');
    }
  }
  private startObserveDOM() {
    this.observeDOM('playlistText');
    this.observeDOM('pageSizeText');
    this.observeDOM('sortOrderText');
    this.observeDOM('releaseYearStart');
    this.observeDOM('releaseYearEnd');
  }
  private stopObserveDOM() {
    // à l'origine de MutationObserver
    this.observers.forEach(x => x.disconnect());
  }
  private prepareFilters() {
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
  private resetFilters() {
    this.filters.searchTerms = null;

    this.filters.playlistText = Playlists.AroundTheWorld.find(x => x.name == 'Monor').name;
    this.filters.playlistValue = Playlists.AroundTheWorld.find(x => x.name == 'Monor').id;

    this.filters.pageSizeText = '10 éléments';
    this.filters.pageSizeValue = 10;

    this.filters.sortOrderText = 'Pertinence';
    this.filters.sortOrderValue = null;

    this.filters.releaseYearStart = 2017;
    this.filters.releaseYearEnd = 2020;
  }
  private propertyObserverSubscription() {
    this.disposables.push(this.be.propertyObserver(this.filters, 'searchTerms').subscribe(() => { this.searchTermsChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'pageSizeText').subscribe(() => { this.pageSizeTextChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'sortOrderText').subscribe(() => { this.sortOrderTextChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'playlistText').subscribe(() => { this.playlistTextChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'releaseYearStart').subscribe(() => { this.releaseYearStartChanged(); }));
    this.disposables.push(this.be.propertyObserver(this.filters, 'releaseYearEnd').subscribe(() => { this.releaseYearEndChanged(); }));
  }
  private propertyOberverUnsubscription() {
    // à l'origine des BindingEngine
    this.disposables.forEach(x => x.dispose());
  }
  private eventAggregatorSubscription() {
    this.subscription = this.ea.subscribe('filtering', (response: IFilter) => {
      this.filters = response;
    });
  }
  private eventAggregatorUnsubscription() {
    // à l'origine de EventAggregator
    this.subscription.dispose();
  }
  private resetSearchTerms() {
    this.filters.searchTerms = null;
  }
  private observeDOM(elm) {
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
  private get showResetFiltersButton() {
    return true;
  }
  private searchTermsChanged() {
    this.filtersChanged();
  }
  private pageSizeTextChanged() {
    var nbr: number = +this.filters.pageSizeText.substr(0, 2);
    this.filters.pageSizeValue = nbr;
    this.filtersChanged();
  }
  private sortOrderTextChanged() {
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
  private playlistTextChanged() {

    var data: IFilter = {};
    var playlist = Playlists.AroundTheWorld.find(x => x.name == this.filters.playlistText);

    if (playlist)
      this.filters.playlistValue = playlist.id;
    else
      debugger;

    // switch (this.filters.playlistText) {
    //   case 'Box office':
    //     this.filters.playlistValue = 'PLHPTxTxtC0iZaTf4DEe-eQ2_sTWuyVFs_';
    //     break;
    //   case 'Populaires':
    //     this.filters.playlistValue = 'PLHPTxTxtC0iY65VCtQssLFRTQwV1ScueG';
    //     break;
    //   case 'Nouveauté à louer':
    //     this.filters.playlistValue = 'PLHPTxTxtC0iY91P_GT7TzcLY_bF-2VOuy';
    //     break;
    //   case 'Mieux notés':
    //     this.filters.playlistValue = 'PLHPTxTxtC0iY7Q9hbREwkLOxkFpaKnhc6';
    //     break;
    //   case 'Nouvelles sorties':
    //     this.filters.playlistValue = 'PLHPTxTxtC0iYAzVsEjJG3_qXPQ12YcTI1';
    //     break;
    //   case 'Top des ventes':
    //     this.filters.playlistValue = 'PLHPTxTxtC0iZUGnexGOfXIIN_tCQrOU67';
    //     break;
    //   case 'Monor':
    //     this.filters.playlistValue = 'PLLoXF47FunjOwLjF4IRNVx3gaMq2UM0dz';
    //     break;
    // }
    this.filtersChanged();
  }
  private releaseYearStartChanged() {
    this.filtersChanged();
  }
  private releaseYearEndChanged() {
    this.filtersChanged();
  }
  private filtersChanged() {
    //debugger;
    if (this.ea) this.ea.publish('filtering', this.filters);
  }
}
