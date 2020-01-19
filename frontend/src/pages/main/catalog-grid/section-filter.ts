import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'malihu-custom-scrollbar-plugin';
import 'jquery.mousewheel';

export class SectionFilter {
  attached() {
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
}
