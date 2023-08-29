const TAIL_IMAGE_DEFAULT = "assets/TaileDefault.png";
const TAIL_IMAGE_BLUE = "assets/TaileBlue.png";
const TAIL_IMAGE_LILAC = "assets/TaileLilac.png";
const TAIL_IMAGE_RED = "assets/TaileRed.png";
const TAIL_IMAGE_YELLOW = "assets/TaileYellow.png";
const TAIL_IMAGE_GREEN = "assets/TaileGreen.png";
const TAIL_IMAGE_BOMB = "assets/TaileBomb.png";

const TAIL_AREA_MAPS  = "assets/TaileAreaMaps.png";
const TAIL_AREA_SCOPE = "assets/TaileAreaScope.png";
const TAIL_AREA_MIXED = "assets/TaileAreaMixed.png";

const TailTypeImage = [
    TAIL_IMAGE_DEFAULT,
    TAIL_IMAGE_BLUE,
    TAIL_IMAGE_LILAC,
    TAIL_IMAGE_RED,
    TAIL_IMAGE_YELLOW,
    TAIL_IMAGE_GREEN,
    TAIL_IMAGE_BOMB];

const TAIL_AREA_POLYGON     = [[70 , 120], [365, 450]];
const TAIL_NEW_GAME_POLYGON = [[645,  35], [685,  75]];
const TAIL_MIXED_POLYGON    = [[445, 460], [510, 490]];

const TAIL_UNDIFINED_ACTION = 0;
const TAIL_AREA_ACTION = 1;
const TAIL_NEW_GAME_ACTION = 2;
const TAIL_MIXED_ACTION = 3;

const TailPolygonAction = [
    [TAIL_AREA_ACTION    , TAIL_AREA_POLYGON],
    [TAIL_NEW_GAME_ACTION, TAIL_NEW_GAME_POLYGON],
    [TAIL_MIXED_ACTION   , TAIL_MIXED_POLYGON]
];

const TAIL_VIEW_REQUEST_POLYGON  = [[505, 190],[600,230]];
const TAIL_VIEW_BONUS_POLYGON    = [[475, 310],[625,305]];
const TAIL_VIEW_MIXED_POLYGON    = [[435, 410],[507,441]];