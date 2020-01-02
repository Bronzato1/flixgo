export class ViewModelBase {
  private attached() {
    this.injectBackgroundImage();
  }
  private injectBackgroundImage() {
    /*==============================
        Section bg
    ==============================*/
    $('.section--bg, .details__bg').each(function () {
      if ($(this).attr("data-bg")) {
        $(this).css({
          'background': 'url(' + $(this).data('bg') + ')',
          'background-position': 'center center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
        });
      }
    });
  }
}
