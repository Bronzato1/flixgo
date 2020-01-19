interface JQuery {
  moreLines(options: MoreLines): void;
}

interface JQueryStatic {
  magnificPopup: any;
}

type MoreLines = {
  linecount: number;
  baseclass: string;
  basejsclass: string;
  classspecific: string;
  buttontxtmore: string;
  buttontxtless: string;
  animationspeed: number;
};
