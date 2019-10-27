import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'malihu-custom-scrollbar-plugin';
import 'jquery.mousewheel';

export class Post2 {
  attached() {
      (<any>$('.scrollbar-dropdown')).mCustomScrollbar({
        axis: "y",
        scrollbarPosition: "outside",
        theme: "custom-bar"
      });

      (<any>$('.accordion')).mCustomScrollbar({
        axis: "y",
        scrollbarPosition: "outside",
        theme: "custom-bar2"
      });

  }
}
