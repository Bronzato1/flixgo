import * as moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/en-gb';

export class HumanizeValueConverter {
  toView(value) {
    moment.locale('fr');              // <-- set french language
    var now = moment();               // <-- get the current date/time
    var then = value;
    var ms = moment(now).diff(then);  // <-- get the difference in milliseconds
    var d = moment.duration(ms);      // <-- to create a duration
    var s = d.humanize();
    return 'il y a ' + s;
  }
}
