interface JQuery {
  moreLines(options: MoreLines): void;
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
