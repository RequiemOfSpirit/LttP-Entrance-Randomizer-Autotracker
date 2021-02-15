import { WorldType } from "./types/locations.types";
import { EntranceLocationId } from "./types/mapData.types";

import { EntranceLocation } from "./locations";
import { InvalidScreenIndexError } from "./errors";

type EntranceLocationList = {
  [key in EntranceLocationId]: EntranceLocation
};

type ScreenData = {
  [key in WorldType]: { [key: number]: Array<EntranceLocationId> }
};

enum TagNew {
  /* Processing Tags */
  DARK_ROOM = "DarkRoom",
  SINGLE_ENTRANCE = "SingleEntrance",
  FILE_SELECT_SCREEN = "FileSelectScreen",

  /* Filter Tags */
  ITEM_CAVE = "ItemCave",
  STORYTELLER = "Storyteller",
  DROPDOWN = "Dropdown",
  DUNGEON = "Dungeon",
  CONNECTOR = "Connector",
};

type RawLocation = {
  x: number;
  y: number;
  name: string;
  screenIndex: number;
  worldType: number;
  tags: { [key in TagNew]?: boolean }
};

// TODO (BACKLOG): Add duplicates for things like GT where the entrance drops you off in a different place
const RAW_LOCATIONS: { [key in EntranceLocationId]: RawLocation } = {
  /* OVERWORLD */
  // LIGHT WORLD
  // Lost Woods and Lumberjack Area
  '64b24cv54': { x: 744, y: 599, name: 'Lost Woods Thief Entrance', screenIndex: 0, worldType: 0, tags: {} },
  'j8lozfmed': { x: 752, y: 23, name: 'Lost Woods Stump', screenIndex: 0, worldType: 0, tags: {} },
  'ui89zwgs4': { x: 768, y: 404, name: 'Lost Woods Thief Dropdown', screenIndex: 0, worldType: 0, tags: {} },
  '1fd6eym4w': { x: 1352, y: 119, name: 'Lumberjack Cave Entrance', screenIndex: 2, worldType: 0, tags: {} },
  '0f2rc62hk': { x: 1368, y: 232, name: 'Lumberjack House', screenIndex: 2, worldType: 0, tags: {} },
  'g41e5kc7k': { x: 1224, y: 174, name: 'Lumberjack Dropdown', screenIndex: 2, worldType: 0, tags: {} },
  '2pbdbwmhd': { x: 1448, y: 712, name: 'DM Ascent Entrance Cave', screenIndex: 10, worldType: 0, tags: {} },
  'f6jpglvlk': { x: 1464, y: 616, name: 'DM Descent Exit Cave', screenIndex: 10, worldType: 0, tags: {} },

  // LW West Death Mountain
  'hdca36aob': { x: 1656, y: 760, name: 'DM Ascent Exit Cave', screenIndex: 3, worldType: 0, tags: {} },
  'b9ncm8ogx': { x: 1832, y: 951, name: 'Old Man Cave Entrance', screenIndex: 3, worldType: 0, tags: {} },
  'k7zonjhg4': { x: 2184, y: 648, name: 'Old Man Back Entrance', screenIndex: 3, worldType: 0, tags: {} },
  'iznw77e5r': { x: 1608, y: 550, name: 'DM Descent Entrance Cave', screenIndex: 3, worldType: 0, tags: {} },
  'wk1ie6ke8': { x: 1992, y: 406, name: 'Spec Rock Upper Entrance', screenIndex: 3, worldType: 0, tags: {} },
  'y3jy2csry': { x: 1864, y: 551, name: 'Kiki Skip Cave Entrance', screenIndex: 3, worldType: 0, tags: {} },
  '3wi2l4l0n': { x: 1992, y: 584, name: 'Spec Rock Lower Entrance', screenIndex: 3, worldType: 0, tags: {} },
  '3n7rsfhw9': { x: 2288, y: 120, name: 'Hera Entrance', screenIndex: 3, worldType: 0, tags: {} },

  // LW East Death Mountain
  'golj02u36': { x: 3256, y: 360, name: 'Spiral Cave Entrance', screenIndex: 5, worldType: 0, tags: {} },
  'i4cdxqek4': { x: 3448, y: 360, name: 'Mimic Cave Entrance', screenIndex: 5, worldType: 0, tags: {} },
  'pyu9cej3k': { x: 3352, y: 454, name: 'Light World EDM Middle Dropdown Cave', screenIndex: 5, worldType: 0, tags: {} },
  '39t7ufppe': { x: 3352, y: 552, name: 'Light World EDM Lower Middle', screenIndex: 5, worldType: 0, tags: {} },
  '7b3hwcgpz': { x: 3272, y: 518, name: 'Light World EDM Lower Left', screenIndex: 5, worldType: 0, tags: {} },
  'wtppb04z1': { x: 3448, y: 582, name: 'Light World EDM Lower Right - Left', screenIndex: 5, worldType: 0, tags: {} },
  'oc54diimq': { x: 3496, y: 582, name: 'Light World EDM Lower Right - Right', screenIndex: 5, worldType: 0, tags: {} },
  'sfwckmava': { x: 3528, y: 872, name: 'Light World EDM Bottom', screenIndex: 5, worldType: 0, tags: {} },
  'oxhp20rxk': { x: 3512, y: 248, name: 'Paradox Cave Upper Entrance', screenIndex: 5, worldType: 0, tags: {} },

  // Sanc Area
  'p0lg9r4d0': { x: 1880, y: 1080, name: 'Sanc Entrance', screenIndex: 19, worldType: 0, tags: {} },
  'evglz1sp2': { x: 1592, y: 1192, name: 'Bonk Rocks Entrance', screenIndex: 19, worldType: 0, tags: {} },
  'dhflh6zjf': { x: 2120, y: 1070, name: 'Sanc Dropdown', screenIndex: 20, worldType: 0, tags: {} },
  'g60r7knk8': { x: 2328, y: 1112, name: 'Graveyard Ledge Entrance', screenIndex: 20, worldType: 0, tags: {} },
  '19iaclilc': { x: 2456, y: 1207, name: "King's Tomb Entrance", screenIndex: 20, worldType: 0, tags: {} },
  'fmcrtr4mu': { x: 2728, y: 1111, name: 'Fairy Dropdown Cave Entrance', screenIndex: 21, worldType: 0, tags: {} },
  'lychvb3jf': { x: 2624, y: 1144, name: 'Fairy Dropdown Hole', screenIndex: 21, worldType: 0, tags: {} },

  // Witch Hut and Zora's Domain
  '20imoyvnz': { x: 3680, y: 535, name: 'Waterfall Cave Entrance', screenIndex: 15, worldType: 0, tags: {} },
  'yqp3drrwx': { x: 3272, y: 1352, name: 'Witch Hut Entrance', screenIndex: 22, worldType: 0, tags: {} },

  // Kakariko
  'j1qr5b47w': { x: 760, y: 1303, name: 'Kakariko Fortune Teller ', screenIndex: 17, worldType: 0, tags: {} },
  '8vt3c6mgr': { x: 680, y: 1703, name: 'Kak Long Right Entrance', screenIndex: 24, worldType: 0, tags: {} },
  'bvct77lhy': { x: 616, y: 1704, name: 'Kak Long Left Entrance', screenIndex: 24, worldType: 0, tags: {} },
  'rg7h0tejw': { x: 520, y: 1703, name: "Blind's House Entrance", screenIndex: 24, worldType: 0, tags: {} },
  'ss10v3tk4': { x: 184, y: 1734, name: 'Kak Well Entrance', screenIndex: 24, worldType: 0, tags: {} },
  'g7tpw3th0': { x: 88, y: 1614, name: 'Kak Well Dropdown', screenIndex: 24, worldType: 0, tags: {} },
  'u8csd0vwh': { x: 200, y: 1896, name: 'Kak Angry Lady Left', screenIndex: 24, worldType: 0, tags: {} },
  '7al5qzf45': { x: 840, y: 1959, name: 'Kak Angry Lady Right', screenIndex: 24, worldType: 0, tags: {} },
  '8c6fr4rss': { x: 824, y: 2167, name: 'Kak Bush House', screenIndex: 24, worldType: 0, tags: {} },
  'wf97ea7cb': { x: 632, y: 2184, name: 'Sick Kid Entrance', screenIndex: 24, worldType: 0, tags: {} },
  'bxsqk002u': { x: 392, y: 2200, name: 'Chicken House Entrance', screenIndex: 24, worldType: 0, tags: {} },
  'sy8ss07sh': { x: 104, y: 2424, name: 'Kak Refill Hut Entrance', screenIndex: 24, worldType: 0, tags: {} },
  '8e7zhrdwo': { x: 440, y: 2375, name: 'Kak Shop', screenIndex: 24, worldType: 0, tags: {} },
  '3bly7onea': { x: 648, y: 2423, name: 'Bar Front', screenIndex: 24, worldType: 0, tags: {} },
  '387ris7wv': { x: 648, y: 2313, name: 'Bar Back Entrance', screenIndex: 24, worldType: 0, tags: {} },
  'ep75ipygz': { x: 1240, y: 2168, name: 'Smith Hut Entrance', screenIndex: 34, worldType: 0, tags: {} },
  'w7v040fpe': { x: 1288, y: 2264, name: 'Smith Cave Entrance', screenIndex: 34, worldType: 0, tags: {} },
  'xrz2q05vu': { x: 1320, y: 2172, name: 'Magic Bat Dropdown', screenIndex: 34, worldType: 0, tags: {} },

  // Link's House Area and Hyrule Castle
  'vurqn80hk': { x: 2248, y: 1750, name: 'Uncle Cave Entrance', screenIndex: 27, worldType: 0, tags: {} },
  '25fpdxm1a': { x: 2432, y: 1574, name: 'Uncle Dropdown', screenIndex: 27, worldType: 0, tags: {} },
  'y1tjn3vqq': { x: 2040, y: 1784, name: 'Hyrule Castle Main Entrance', screenIndex: 27, worldType: 0, tags: {} },
  'rl0lrk8ka': { x: 1832, y: 1574, name: 'Hyrule Castle Left Entrance', screenIndex: 27, worldType: 0, tags: {} },
  'tuhueb9p3': { x: 2248, y: 1576, name: 'Hyrule Castle Right Entrance', screenIndex: 27, worldType: 0, tags: {} },
  '6u78i5x7a': { x: 2040, y: 1624, name: "Agahnim's Tower Entrance", screenIndex: 27, worldType: 0, tags: {} },
  'alyy2v4p7': { x: 1928, y: 2663, name: "Link's House Bonk Rocks", screenIndex: 43, worldType: 0, tags: {} },
  '7b9en7h88': { x: 2232, y: 2807, name: "Link's House Entrance", screenIndex: 44, worldType: 0, tags: {} },
  '7a6egaqwu': { x: 2648, y: 3272, name: "Link's House Fortune Teller", screenIndex: 53, worldType: 0, tags: {} },
  'qwfapn54h': { x: 2968, y: 3126, name: "Link's House Shop", screenIndex: 53, worldType: 0, tags: {} },

  // Eastern Area
  'jayycekr1': { x: 3920, y: 1576, name: 'Eastern Entrance', screenIndex: 30, worldType: 0, tags: {} },
  '084t16xbh': { x: 3312, y: 1848, name: 'Sahasrahla Entrance', screenIndex: 30, worldType: 0, tags: {} },
  '1xldoiq70': { x: 3368, y: 2632, name: 'Eastern Fairy Cave', screenIndex: 46, worldType: 0, tags: {} },
  'm4e8fxnec': { x: 4008, y: 2854, name: 'Flute 5 Cave', screenIndex: 47, worldType: 0, tags: {} },

  // South Kakariko
  'b7t2xf67n': { x: 440, y: 2920, name: 'Race Game Entrance', screenIndex: 40, worldType: 0, tags: {} },
  '37klo0zbw': { x: 632, y: 2679, name: 'Library Entrance', screenIndex: 41, worldType: 0, tags: {} },
  'mxdzw0zp5': { x: 568, y: 2920, name: 'Race Game Right Entrance', screenIndex: 41, worldType: 0, tags: {} },
  'd5w6a9vg9': { x: 872, y: 2856, name: 'Light World Chest Game', screenIndex: 41, worldType: 0, tags: {} },
  'di01idz4h': { x: 1080, y: 3368, name: 'Cave 45 Entrance', screenIndex: 50, worldType: 0, tags: {} },

  // Desert Area
  'zpupnilhb': { x: 296, y: 3255, name: 'Desert Main Entrance', screenIndex: 48, worldType: 0, tags: {} },
  'mtebt9qw': { x: 136, y: 3239, name: 'Desert Ledge Entrance', screenIndex: 48, worldType: 0, tags: {} },
  'xcguhwzoy': { x: 296, y: 3126, name: 'Desert 2 Entrance', screenIndex: 48, worldType: 0, tags: {} },
  '31wvc0w0t': { x: 456, y: 3239, name: 'Desert Right Entrance', screenIndex: 48, worldType: 0, tags: {} },
  'v8682d00s': { x: 808, y: 3368, name: "Aginah's Cave Entrance", screenIndex: 48, worldType: 0, tags: {} },
  '7j6065bjv': { x: 712, y: 3174, name: 'Checkerboard Cave Entrance', screenIndex: 48, worldType: 0, tags: {} },
  'rl46q678a': { x: 1272, y: 3910, name: 'M-Rock', screenIndex: 58, worldType: 0, tags: {} },
  '82o2j7i2d': { x: 1128, y: 3640, name: 'M-Cave', screenIndex: 58, worldType: 0, tags: {} },

  // South Shore and Lake Hylia
  '35f58reu6': { x: 2440, y: 3176, name: 'Light World Hype Cave Entrance', screenIndex: 52, worldType: 0, tags: {} },
  '8h00op2sp': { x: 3240, y: 3478, name: 'Luck Fairy Entrance', screenIndex: 53, worldType: 0, tags: {} },
  '3cqaa1o1k': { x: 2664, y: 3831, name: 'Mini Moldorm Cave Entrance', screenIndex: 53, worldType: 0, tags: {} },
  'eip5mlo2v': { x: 3656, y: 3144, name: 'Ice Rod Cave Left', screenIndex: 55, worldType: 0, tags: {} },
  '74ve9duvk': { x: 3736, y: 3143, name: 'Ice Rod Cave Right', screenIndex: 55, worldType: 0, tags: {} },
  'qbe97zsy4': { x: 3688, y: 3206, name: 'Ice Rod Cave Rock', screenIndex: 55, worldType: 0, tags: {} },
  'icm2c3j5v': { x: 1912, y: 3815, name: 'Dam Entrance', screenIndex: 59, worldType: 0, tags: {} },

  // DARK WORLD
  // Skull Woods
  'kedti3d8h': { x: 152, y: 200, name: 'Skull 3 Entrance', screenIndex: 64, worldType: 0, tags: {} },
  'fwj3remme': { x: 232, y: 519, name: 'Skull 2 Exit', screenIndex: 64, worldType: 0, tags: {} },
  'ql1r7umam': { x: 488, y: 242, name: 'Skull Back Dropdown', screenIndex: 64, worldType: 0, tags: {} },
  'uqnh8qbeg': { x: 584, y: 584, name: 'Skull 2 Entrance', screenIndex: 64, worldType: 0, tags: {} },
  'nrs7onft9': { x: 744, y: 600, name: 'Skull Woods 1 Entrance', screenIndex: 64, worldType: 0, tags: {} },
  'k4jxapsw9': { x: 632, y: 590, name: 'Skull Woods Left Dropdown', screenIndex: 64, worldType: 0, tags: {} },
  'stcnwrjha': { x: 792, y: 562, name: 'Skull Woods Right Dropdown', screenIndex: 64, worldType: 0, tags: {} },
  'l2cjgstyy': { x: 768, y: 406, name: 'Skull Woods Bush Dropdown', screenIndex: 64, worldType: 0, tags: {} },

  // Dark Lumberjack Area and Dark Sanc
  'uvcn71n0a': { x: 1368, y: 215, name: 'Dark World Lumberjack House', screenIndex: 66, worldType: 0, tags: {} },
  '363wugx43': { x: 1464, y: 614, name: 'Bumper Upper Entrance', screenIndex: 74, worldType: 0, tags: {} },
  'cb0dj5u52': { x: 1448, y: 710, name: 'Bumper Lower Entrance', screenIndex: 74, worldType: 0, tags: {} },
  '36c1butos': { x: 1880, y: 1110, name: 'Dark Sanctuary', screenIndex: 83, worldType: 0, tags: {} },
  '0rfv56t9q': { x: 1352, y: 1864, name: 'Curiosity Shop Entrance', screenIndex: 90, worldType: 0, tags: {} },

  // DW West Death Mountain
  '6vcjgdnkc': { x: 1656, y: 759, name: 'Dark World WDM Lower Left', screenIndex: 67, worldType: 0, tags: {} },
  'yt1yg46o7': { x: 2344, y: 584, name: 'Spike Cave Entrance', screenIndex: 67, worldType: 0, tags: {} },
  'fjx7dxmja': { x: 2296, y: 55, name: 'GT Entrance', screenIndex: 67, worldType: 0, tags: {} },

  // DW East Death Mountain
  '2rumv2vfl': { x: 3272, y: 54, name: 'Sky Island Entrance', screenIndex: 69, worldType: 0, tags: {} },
  '09hc5np0y': { x: 3400, y: 263, name: 'Hookshot Cave Entrance', screenIndex: 69, worldType: 0, tags: {} },
  'j9sy2ol4i': { x: 3512, y: 248, name: 'Super Bunny Cave Exit', screenIndex: 69, worldType: 0, tags: {} },
  '9t5iz39zy': { x: 3256, y: 360, name: 'Turtle Rock Bridge Left', screenIndex: 69, worldType: 0, tags: {} },
  'pjm34bkpr': { x: 3448, y: 358, name: 'Turtle Rock Bridge Right', screenIndex: 69, worldType: 0, tags: {} },
  'ee3uukmy6': { x: 3352, y: 454, name: 'Turtle Rock Laser Bridge Outside', screenIndex: 69, worldType: 0, tags: {} },
  'g3gwr4kwp': { x: 3448, y: 582, name: 'Dark World EDM Bottom Left', screenIndex: 69, worldType: 0, tags: {} },
  'sr11i08n9': { x: 3496, y: 582, name: 'Dark World EDM Bottom Right', screenIndex: 69, worldType: 0, tags: {} },
  'lpdqso2qv': { x: 3848, y: 311, name: 'Turtle Rock Main Entrance', screenIndex: 71, worldType: 0, tags: {} },

  // Village of Outcasts
  '9scgfrbhn': { x: 760, y: 1303, name: 'VoO Fortune Teller', screenIndex: 81, worldType: 0, tags: {} },
  '5cgh62zs9': { x: 840, y: 1959, name: 'C House Entrance', screenIndex: 88, worldType: 0, tags: {} },
  'tnqljf49b': { x: 504, y: 1975, name: 'Thieves Town Entrance', screenIndex: 88, worldType: 0, tags: {} },
  'f26oniitj': { x: 200, y: 1896, name: 'VoO Chest Game Entrance', screenIndex: 88, worldType: 0, tags: {} },
  '9oych22iq': { x: 440, y: 2375, name: 'Brewery Entrance', screenIndex: 88, worldType: 0, tags: {} },
  '7iz3zoohu': { x: 824, y: 2167, name: 'VoO Hammer Pegs House', screenIndex: 88, worldType: 0, tags: {} },
  'wodashxno': { x: 1288, y: 2470, name: 'Hammer Pegs Entrance', screenIndex: 98, worldType: 0, tags: {} },
  '71ju2r5o4': { x: 872, y: 2856, name: 'VoO Arrow Game Entrance', screenIndex: 105, worldType: 0, tags: {} },

  // Pyramid and PoD Area
  '1tvfd0zc8': { x: 3288, y: 1367, name: 'Dark World Witch Hut', screenIndex: 86, worldType: 0, tags: {} },
  'wnlqqv6ed': { x: 1912, y: 1974, name: 'Pyramid Fairy Entrance', screenIndex: 91, worldType: 0, tags: {} },
  'z6iuj55xi': { x: 2031, y: 1546, name: 'Pyramid Hole', screenIndex: 91, worldType: 0, tags: {} },
  'hao6j8b9f': { x: 1768, y: 1976, name: 'Ganon Fall Entrance', screenIndex: 91, worldType: 0, tags: {} },
  '8n9h7wcbl': { x: 3472, y: 2039, name: 'PoD Area House', screenIndex: 94, worldType: 0, tags: {} },
  'mb2zrclgh': { x: 3920, y: 1592, name: 'PoD Entrance', screenIndex: 94, worldType: 0, tags: {} },
  'rxhcki6vl': { x: 3368, y: 2630, name: 'South of PoD Fairy Cave', screenIndex: 110, worldType: 0, tags: {} },
  '80op7goc8': { x: 4008, y: 2854, name: 'Dark World Flute 5 Cave', screenIndex: 111, worldType: 0, tags: {} },

  // Mire Area
  '9oh5ivi1j': { x: 808, y: 3368, name: 'Mire Aginah Cave Entrance', screenIndex: 112, worldType: 0, tags: {} },
  '2l8cytupi': { x: 440, y: 3270, name: 'Mire Shed Right Entrance', screenIndex: 112, worldType: 0, tags: {} },
  'arv1kig0m': { x: 152, y: 3270, name: 'Mire Shed Left Entrance', screenIndex: 112, worldType: 0, tags: {} },
  'hb3cp7zq8': { x: 296, y: 3287, name: 'Mire Entrance', screenIndex: 112, worldType: 0, tags: {} },

  // Bomb Shop and Ice Palace Area
  '8044x7y8r': { x: 1928, y: 2664, name: "Dark World Link's House Bonk Rocks", screenIndex: 107, worldType: 0, tags: {} },
  'v5izc47dq': { x: 2232, y: 2807, name: 'Bomb Shop Entrance', screenIndex: 108, worldType: 0, tags: {} },
  'se02js65n': { x: 2440, y: 3175, name: 'Hype Cave Entrance', screenIndex: 116, worldType: 0, tags: {} },
  'nxcyw6sub': { x: 3256, y: 3527, name: 'Ice Palace Entrance', screenIndex: 117, worldType: 0, tags: {} },
  'f8gopt21p': { x: 2648, y: 3272, name: 'House Right of Bomb Shop', screenIndex: 117, worldType: 0, tags: {} },
  'f3s6745at': { x: 3736, y: 3144, name: 'Shopping Mall Right Entrance', screenIndex: 119, worldType: 0, tags: {} },
  'x5e2sqo9e': { x: 3688, y: 3206, name: 'Shopping Mall Lift Up Rock', screenIndex: 119, worldType: 0, tags: {} },
  '5l7afmq2x': { x: 3656, y: 3144, name: 'Shopping Mall Left Entrance', screenIndex: 119, worldType: 0, tags: {} },
  'egiyeguoo': { x: 1912, y: 3816, name: 'Swamp Entrance', screenIndex: 123, worldType: 0, tags: {} },

  /* UNDERWORLD */
  // Dropdowns
  'ej49vy1qx': { x: 383, y: 0, name: 'Ganon', screenIndex: 0, worldType: 1, tags: {} },
  'm4ijulscj': { x: 915, y: 669, name: 'Escape', screenIndex: 17, worldType: 1, tags: {} },
  '25k2ewbaf': { x: 4211, y: 702, name: 'DEAD (Fairy Dropdown Cave Dropdown)', screenIndex: 24, worldType: 1, tags: {} },
  'uddloejvv': { x: 7777, y: 1280, name: 'Kak Well', screenIndex: 47, worldType: 1, tags: {} },
  '26xwt6pmy': { x: 2975, y: 2560, name: 'Uncle', screenIndex: 85, worldType: 1, tags: {} },
  'rguvdl5qk': { x: 880, y: 7213, name: 'Lost Woods Thief', screenIndex: 225, worldType: 1, tags: {} },
  'o3248gsj8': { x: 1151, y: 7424, name: 'Lumberjack Cave', screenIndex: 226, worldType: 1, tags: {} },
  'gwyd6nobo': { x: 1912, y: 7424, name: 'Magic Bat', screenIndex: 227, worldType: 1, tags: {} },

  // SW Dropdowns
  'ju56k7jss': { x: 3392, y: 2544, name: 'Skull Woods 2 Drop', screenIndex: 86, worldType: 1, tags: {} },
  'af405kt8a': { x: 4496, y: 2544, name: 'Skull Woods 1 Pot Circle', screenIndex: 88, worldType: 1, tags: {} },
  'akiw2porv': { x: 3712, y: 3056, name: 'Skull Woods 1 Left', screenIndex: 103, worldType: 1, tags: {} },
  '66z7aanch': { x: 4352, y: 3097, name: 'Skull Woods 1 Softlock Room', screenIndex: 104, worldType: 1, tags: {} },

  // Dropdown Exits
  '39qzcysny': { x: 120, y: 984, name: 'Ganon Fall Inside', screenIndex: 16, worldType: 1, tags: {} },
  'nqhl00m0i': { x: 1272, y: 960, name: 'Sanc Inside', screenIndex: 18, worldType: 1, tags: {} },
  'g9zsgbv5m': { x: 4472, y: 472, name: 'DEAD (Fairy Dropdown Cave Inside)', screenIndex: 8, worldType: 1, tags: {} },
  'qpu9bbwqm': { x: 8056, y: 1496, name: 'Kak Well Inside', screenIndex: 47, worldType: 1, tags: {} },
  't4ssrl8m0': { x: 2680, y: 3032, name: 'Uncle Cave Inside', screenIndex: 85, worldType: 1, tags: {} },
  'bpu91pg0l': { x: 632, y: 7640, name: 'Lost Woods Thief Entrance Inside', screenIndex: 225, worldType: 1, tags: {} },
  'vekorqpiq': { x: 1400, y: 7640, name: 'Lumberjack Cave Inside', screenIndex: 226, worldType: 1, tags: {} },
  'ldyenf4fm': { x: 1656, y: 7640, name: 'Magic Bat Inside', screenIndex: 227, worldType: 1, tags: {} },

  // Dungeons
  'wbk1h6ibs': { x: 376, y: 3544, name: 'Hyrule Castle Left Inside', screenIndex: 96, worldType: 1, tags: {} },
  't96p87wqn': { x: 760, y: 3520, name: 'Hyrule Castle Main Inside', screenIndex: 97, worldType: 1, tags: {} },
  'ohwr18hx8': { x: 1144, y: 3544, name: 'Hyrule Castle Right Inside', screenIndex: 98, worldType: 1, tags: {} },
  '31248yiqq': { x: 4856, y: 6616, name: 'Eastern Palace', screenIndex: 201, worldType: 1, tags: {} },
  'moazmln10': { x: 1656, y: 4568, name: 'Desert Palace Left Inside', screenIndex: 131, worldType: 1, tags: {} },
  'g9vluwl9v': { x: 2296, y: 4568, name: 'Desert Palace Main Inside', screenIndex: 132, worldType: 1, tags: {} },
  '4iwaatgnw': { x: 2936, y: 4568, name: 'Desert Palace Right Inside', screenIndex: 133, worldType: 1, tags: {} },
  'n6rkkl96w': { x: 1656, y: 3544, name: 'Desert Palace 2 Inside', screenIndex: 99, worldType: 1, tags: {} },
  'ih9k0ke9c': { x: 3832, y: 4032, name: 'Tower of Hera', screenIndex: 119, worldType: 1, tags: {} },
  'fn0aavbbu': { x: 120, y: 7640, name: "Agahnim's Tower Inside", screenIndex: 224, worldType: 1, tags: {} },
  'ui6pkp3ey': { x: 5368, y: 2520, name: 'Palace of Darkness', screenIndex: 74, worldType: 1, tags: {} },
  'at5q7d1ls': { x: 4344, y: 1496, name: 'Swamp Palace', screenIndex: 40, worldType: 1, tags: {} },
  '56wu0ill5': { x: 4216, y: 3032, name: 'Skull Woods 1', screenIndex: 88, worldType: 1, tags: {} },
  'vmp83gwvi': { x: 3192, y: 3032, name: 'Skull Woods 2 Left', screenIndex: 86, worldType: 1, tags: {} },
  'c5dydzhv6': { x: 3704, y: 3032, name: 'Skull Woods 2 Right', screenIndex: 87, worldType: 1, tags: {} },
  'y1rfgbrv6': { x: 4728, y: 3032, name: 'Skull Woods 3', screenIndex: 89, worldType: 1, tags: {} },
  'twy05rv7y': { x: 5880, y: 7128, name: 'Thieves Town', screenIndex: 219, worldType: 1, tags: {} },
  'xpasc8pma': { x: 7544, y: 472, name: 'Ice Palace', screenIndex: 14, worldType: 1, tags: {} },
  '3m931urju': { x: 4216, y: 5080, name: 'Misery Mire', screenIndex: 152, worldType: 1, tags: {} },
  'n5ju1a83c': { x: 3448, y: 7128, name: 'Turtle Rock Front', screenIndex: 214, worldType: 1, tags: {} },
  '0z56aojkq': { x: 1912, y: 1496, name: 'Turtle Rock Laser Eyes', screenIndex: 35, worldType: 1, tags: {} },
  'iwgccn71r': { x: 2424, y: 1496, name: 'Turtle Rock Big Chest', screenIndex: 36, worldType: 1, tags: {} },
  'qj5bpdfoy': { x: 2680, y: 7128, name: 'Turtle Rock Laser Bridge', screenIndex: 213, worldType: 1, tags: {} },
  'qjtnaaj5x': { x: 6392, y: 472, name: "Ganon's Tower", screenIndex: 12, worldType: 1, tags: {} },

  // Single Entrance Item Caves
  'krxlgd7xz': { x: 1144, y: 8664, name: 'Sick Kid Inside', screenIndex: 258, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'i4kntfo6i': { x: 1656, y: 8224, name: 'Bar Back', screenIndex: 259, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '19hxcr5wk': { x: 2424, y: 8664, name: "Link's House Inside", screenIndex: 260, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'p9cgnw30z': { x: 2680, y: 8664, name: 'Sahasrahla Inside', screenIndex: 261, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '7tkgab01x': { x: 3192, y: 8664, name: 'Chest Game', screenIndex: 262, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'bc9t5dws6': { x: 3448, y: 8664, name: 'Brewery Inside', screenIndex: 262, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'es3b2gzqm': { x: 3704, y: 8664, name: 'Library Inside', screenIndex: 263, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '04nw8z3qa': { x: 4216, y: 8664, name: 'Chicken House Inside', screenIndex: 264, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'owcds44b4': { x: 4728, y: 8664, name: 'Witch Hut Inside', screenIndex: 265, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'spananuc4': { x: 5240, y: 8640, name: "Aginah's Cave Inside", screenIndex: 266, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'ea2aua0om': { x: 5880, y: 8664, name: 'Dam Inside', screenIndex: 267, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'zzday20ds': { x: 6264, y: 8664, name: 'Mimic Cave Inside', screenIndex: 268, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '7nd75oewg': { x: 6776, y: 8664, name: 'Mire Shed Inside', screenIndex: 269, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '6frz16gyk': { x: 1656, y: 9176, name: "King's Tomb Inside", screenIndex: 275, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '2bjlp6akr': { x: 2168, y: 9176, name: 'Waterfall Cave Inside', screenIndex: 276, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'mm243s9pv': { x: 2680, y: 9176, name: 'Luck Fairy Inside', screenIndex: 277, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'zplxg3dcd': { x: 3448, y: 9176, name: 'Pyramid Fairy Inside', screenIndex: 278, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '9whl3ziez': { x: 3960, y: 9176, name: 'Spike Cave Inside', screenIndex: 279, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'd8oy268sz': { x: 4856, y: 9176, name: "Blind's House Inside", screenIndex: 281, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'dcpoqzj5o': { x: 5752, y: 9152, name: 'Cave 45 Inside', screenIndex: 283, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '1ht9pa79g': { x: 6008, y: 9176, name: 'Graveyard Ledge Inside', screenIndex: 283, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '1fifrqph0': { x: 6520, y: 9176, name: 'C House Inside', screenIndex: 284, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '272izo9o7': { x: 6264, y: 9176, name: 'Bomb Shop Inside', screenIndex: 284, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '5hk5k4bbh': { x: 7544, y: 9176, name: 'Hype Cave', screenIndex: 286, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '8aohx1578': { x: 120, y: 9688, name: 'Ice Rod Cave Inside', screenIndex: 288, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '5a2izxqmf': { x: 632, y: 9688, name: 'Smith Inside', screenIndex: 289, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'gqtfqdeq1': { x: 1656, y: 9688, name: 'Mini Moldorm Cave Inside', screenIndex: 291, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'zzd9emewu': { x: 2424, y: 9688, name: 'Bonk Rocks Inside', screenIndex: 292, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'wktnl5bxq': { x: 3448, y: 9688, name: 'Checkerboard Cave Inside', screenIndex: 294, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'fi58mt715': { x: 3704, y: 9688, name: 'Hammer Pegs Inside', screenIndex: 295, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },

  // Multi Entrance Item Caves
  'kbjbax7gj': { x: 6520, y: 2008, name: 'Hookshot Cave Inside', screenIndex: 60, worldType: 1, tags: {} },
  '4tfiagqok': { x: 6264, y: 1496, name: 'Hookshot Cave Back Inside', screenIndex: 44, worldType: 1, tags: {} },
  '2tzrkccjg': { x: 7928, y: 7128, name: 'Paradox Cave Upper Inside', screenIndex: 223, worldType: 1, tags: {} },
  'xe6652b7y': { x: 7928, y: 7640, name: 'Paradox Cave Mid Inside', screenIndex: 239, worldType: 1, tags: {} },
  'qhdgtpg0r': { x: 8056, y: 8152, name: 'Paradox Cave Lower Inside', screenIndex: 255, worldType: 1, tags: {} },
  'r9fdld0qf': { x: 4472, y: 7640, name: 'Super Bunny Cave Exit Inside', screenIndex: 232, worldType: 1, tags: {} },
  'jaatjooio': { x: 4344, y: 8152, name: 'Super Bunny Cave Lower Inside', screenIndex: 248, worldType: 1, tags: {} },
  'yooonv21j': { x: 5240, y: 7640, name: 'Spec Rock Upper Inside', screenIndex: 234, worldType: 1, tags: {} },
  'xxjksc9be': { x: 4728, y: 8152, name: 'Kiki Skip Inside', screenIndex: 249, worldType: 1, tags: {} },
  'bukdravt5': { x: 5240, y: 8128, name: 'Spec Rock Lower Inside', screenIndex: 250, worldType: 1, tags: {} },

  // CW Connectors
  '4ubccpima': { x: 2168, y: 7616, name: 'Old Man Cave Inside', screenIndex: 228, worldType: 1, tags: {} },
  'pf6c4iivz': { x: 2808, y: 7640, name: 'Old Man Back Entrance Inside', screenIndex: 229, worldType: 1, tags: { [TagNew.DARK_ROOM]: true } },
  'z3c9cigkk': { x: 3192, y: 7616, name: 'DM Descent Exit Inside', screenIndex: 230, worldType: 1, tags: { [TagNew.DARK_ROOM]: true } },
  '5tizy8d5o': { x: 3960, y: 7616, name: 'DM Descent Entrance Inside', screenIndex: 231, worldType: 1, tags: { [TagNew.DARK_ROOM]: true } },
  'visnqcj2f': { x: 6008, y: 7640, name: 'Bumper Upper Inside', screenIndex: 235, worldType: 1, tags: {} },
  'h7u9tah2z': { x: 5880, y: 8152, name: 'Bumper Lower Inside', screenIndex: 251, worldType: 1, tags: {} },
  'mhov971bz': { x: 7032, y: 7640, name: 'EDM Shit Cave Upper Inside', screenIndex: 237, worldType: 1, tags: {} },
  'fht7thlat': { x: 6904, y: 8128, name: 'EDM Shit Cave Lower Inside', screenIndex: 253, worldType: 1, tags: {} },
  '0kagr845z': { x: 7544, y: 7640, name: 'Spiral Cave Upper Inside', screenIndex: 238, worldType: 1, tags: {} },
  'kt1w0mdoj': { x: 7544, y: 8128, name: 'Spiral Cave Lower Inside', screenIndex: 254, worldType: 1, tags: {} },
  'zn2lpvo5o': { x: 120, y: 8152, name: 'DM Ascent Entrance Inside', screenIndex: 240, worldType: 1, tags: { [TagNew.DARK_ROOM]: true } },
  'g6g9u3hff': { x: 888, y: 8128, name: 'DM Ascent Exit Inside', screenIndex: 241, worldType: 1, tags: { [TagNew.DARK_ROOM]: true } },
  'xko465hu0': { x: 1400, y: 8152, name: 'Kak Long Left Inside', screenIndex: 242, worldType: 1, tags: {} },
  'v7k8sjyng': { x: 1656, y: 8152, name: 'Kak Long Right Inside', screenIndex: 243, worldType: 1, tags: {} },
  'qe0cyorkp': { x: 2424, y: 8152, name: 'Brothers Left', screenIndex: 244, worldType: 1, tags: {} },
  'e4l87zajc': { x: 2680, y: 8152, name: 'Brothers Right', screenIndex: 245, worldType: 1, tags: {} },

  // Hint/Storyteller Caves
  '63p3xahhe': { x: 7288, y: 8640, name: 'DEAD (Storyteller)', screenIndex: 270, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '3ppygwn5j': { x: 7544, y: 8640, name: 'DEAD (Storyteller)', screenIndex: 270, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'uszewy9c3': { x: 1144, y: 9176, name: 'DEAD (Storyteller)', screenIndex: 274, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '1tr1ckaou': { x: 2424, y: 9176, name: 'DEAD (Storyteller)', screenIndex: 276, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'dtn7bauvr': { x: 5496, y: 9176, name: 'DEAD (Storyteller)', screenIndex: 282, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '3n8q382a6': { x: 2936, y: 9688, name: 'DEAD (Storyteller)', screenIndex: 293, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },

  // Other
  'u6o6m34fa': { x: 120, y: 8664, name: 'DEAD (Gambling Minigame)', screenIndex: 256, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'tv0p4vej3': { x: 888, y: 8664, name: 'DEAD (Chicken Lady House)', screenIndex: 257, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'mtgrhgvi7': { x: 632, y: 8664, name: 'DEAD', screenIndex: 257, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'm81h6hhyi': { x: 1912, y: 8664, name: 'DEAD', screenIndex: 259, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'pn6ds4k28': { x: 1656, y: 8664, name: 'DEAD', screenIndex: 259, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'y14khfr86': { x: 6520, y: 8664, name: 'DEAD', screenIndex: 268, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '97hk8e0u1': { x: 7800, y: 8664, name: 'DEAD (Shop)', screenIndex: 271, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '3ue4xxt5z': { x: 120, y: 9176, name: 'DEAD (Curiosity Shop)', screenIndex: 272, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'gfhpu5icv': { x: 632, y: 9176, name: 'DEAD (Arrow Game)', screenIndex: 273, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'rx03ru8u8': { x: 1400, y: 9176, name: 'DEAD (Shop)', screenIndex: 274, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'fu2j68c0u': { x: 2936, y: 9176, name: 'DEAD (Great Fairy)', screenIndex: 277, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'aht1u865a': { x: 4472, y: 9176, name: 'DEAD (Gambling Minigame)', screenIndex: 280, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  't3lbnk05s': { x: 7288, y: 9176, name: 'DEAD (Fairies Refill)', screenIndex: 286, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '5w815uovg': { x: 7800, y: 9176, name: 'DEAD', screenIndex: 287, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'oto8nms7k': { x: 8056, y: 9176, name: 'DEAD (Shop)', screenIndex: 287, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'sbxu4l7nu': { x: 376, y: 9688, name: 'DEAD', screenIndex: 288, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '6h399mfc8': { x: 1144, y: 9688, name: 'DEAD', screenIndex: 290, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'carww1elv': { x: 1400, y: 9688, name: 'DEAD', screenIndex: 290, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  't15ioob8s': { x: 2680, y: 9688, name: 'DEAD', screenIndex: 293, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  'enornjpyx': { x: 3192, y: 9688, name: 'DEAD (Fairies)', screenIndex: 294, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '945uprmbo': { x: 3960, y: 8664, name: 'Kak Refill Hut Inside', screenIndex: 263, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },
  '1uhropo6s': { x: 2168, y: 9688, name: 'Money Refill Cave', screenIndex: 292, worldType: 1, tags: { [TagNew.SINGLE_ENTRANCE]: true } },

  /* NON-ENTRANCES */
  // TODO (BACKLOG): Add File select screen, houlihan, boss rooms here
};

function generateEntranceLocation(location: RawLocation, locationId: EntranceLocationId): EntranceLocation {
  return new EntranceLocation(
    locationId,
    location.name,
    location.worldType,
    location.screenIndex,
    location.x,
    location.y
  );
}

// Merge all key value pairs returned in the map function into one object
const ENTRANCE_LOCATIONS: EntranceLocationList = Object.assign(
  {}, 
  ...Object.keys(RAW_LOCATIONS).map(key => {
    let entranceLocationId = key as EntranceLocationId;
    return {
      [entranceLocationId]: generateEntranceLocation(RAW_LOCATIONS[entranceLocationId], entranceLocationId)
    };
  })
);

// List of entrance ids indexed by their screen index
const SCREEN_DATA: ScreenData = {
  0: {  // Overworld
    '0': ['64b24cv54', 'j8lozfmed', 'ui89zwgs4'],
    '2': ['1fd6eym4w', '0f2rc62hk', 'g41e5kc7k'],
    '3': [
      'hdca36aob',
      'b9ncm8ogx',
      'k7zonjhg4',
      'iznw77e5r',
      'wk1ie6ke8',
      'y3jy2csry',
      '3wi2l4l0n',
      '3n7rsfhw9'
    ],
    '5': [
      'golj02u36', 'i4cdxqek4',
      'pyu9cej3k', '39t7ufppe',
      '7b3hwcgpz', 'wtppb04z1',
      'oc54diimq', 'sfwckmava',
      'oxhp20rxk'
    ],
    '10': ['2pbdbwmhd', 'f6jpglvlk'],
    '15': ['20imoyvnz'],
    '17': ['j1qr5b47w'],
    '19': ['p0lg9r4d0', 'evglz1sp2'],
    '20': ['dhflh6zjf', 'g60r7knk8', '19iaclilc'],
    '21': ['fmcrtr4mu', 'lychvb3jf'],
    '22': ['yqp3drrwx'],
    '24': [
      '8vt3c6mgr', 'bvct77lhy',
      'rg7h0tejw', 'ss10v3tk4',
      'g7tpw3th0', 'u8csd0vwh',
      '7al5qzf45', '8c6fr4rss',
      'wf97ea7cb', 'bxsqk002u',
      'sy8ss07sh', '8e7zhrdwo',
      '3bly7onea', '387ris7wv'
    ],
    '27': [
      'vurqn80hk',
      '25fpdxm1a',
      'y1tjn3vqq',
      'rl0lrk8ka',
      'tuhueb9p3',
      '6u78i5x7a'
    ],
    '30': ['jayycekr1', '084t16xbh'],
    '34': ['ep75ipygz', 'w7v040fpe', 'xrz2q05vu'],
    '40': ['b7t2xf67n'],
    '41': ['37klo0zbw', 'mxdzw0zp5', 'd5w6a9vg9'],
    '43': ['alyy2v4p7'],
    '44': ['7b9en7h88'],
    '46': ['1xldoiq70'],
    '47': ['m4e8fxnec'],
    '48': [
      'zpupnilhb',
      'mtebt9qw',
      'xcguhwzoy',
      '31wvc0w0t',
      'v8682d00s',
      '7j6065bjv'
    ],
    '50': ['di01idz4h'],
    '52': ['35f58reu6'],
    '53': ['8h00op2sp', '7a6egaqwu', 'qwfapn54h', '3cqaa1o1k'],
    '55': ['eip5mlo2v', '74ve9duvk', 'qbe97zsy4'],
    '58': ['rl46q678a', '82o2j7i2d'],
    '59': ['icm2c3j5v'],
    '64': [
      'kedti3d8h',
      'fwj3remme',
      'ql1r7umam',
      'uqnh8qbeg',
      'nrs7onft9',
      'k4jxapsw9',
      'stcnwrjha',
      'l2cjgstyy'
    ],
    '66': ['uvcn71n0a'],
    '67': ['6vcjgdnkc', 'yt1yg46o7', 'fjx7dxmja'],
    '69': [
      '2rumv2vfl',
      '09hc5np0y',
      'j9sy2ol4i',
      '9t5iz39zy',
      'pjm34bkpr',
      'ee3uukmy6',
      'g3gwr4kwp',
      'sr11i08n9'
    ],
    '71': ['lpdqso2qv'],
    '74': ['363wugx43', 'cb0dj5u52'],
    '81': ['9scgfrbhn'],
    '83': ['36c1butos'],
    '86': ['1tvfd0zc8'],
    '88': ['5cgh62zs9', 'tnqljf49b', 'f26oniitj', '9oych22iq', '7iz3zoohu'],
    '90': ['0rfv56t9q'],
    '91': ['wnlqqv6ed', 'z6iuj55xi', 'hao6j8b9f'],
    '94': ['8n9h7wcbl', 'mb2zrclgh'],
    '98': ['wodashxno'],
    '105': ['71ju2r5o4'],
    '107': ['8044x7y8r'],
    '108': ['v5izc47dq'],
    '110': ['rxhcki6vl'],
    '111': ['80op7goc8'],
    '112': ['9oh5ivi1j', '2l8cytupi', 'arv1kig0m', 'hb3cp7zq8'],
    '116': ['se02js65n'],
    '117': ['nxcyw6sub', 'f8gopt21p'],
    '119': ['f3s6745at', 'x5e2sqo9e', '5l7afmq2x'],
    '123': ['egiyeguoo']
  },
  1: {  // Underworld
    '0': ['ej49vy1qx'],
    '8': ['g9zsgbv5m'],
    '12': ['qjtnaaj5x'],
    '14': ['xpasc8pma'],
    '16': ['39qzcysny'],
    '17': ['m4ijulscj'],
    '18': ['nqhl00m0i'],
    '24': ['25k2ewbaf'],
    '35': ['0z56aojkq'],
    '36': ['iwgccn71r'],
    '40': ['at5q7d1ls'],
    '44': ['4tfiagqok'],
    '47': ['qpu9bbwqm', 'uddloejvv'],
    '60': ['kbjbax7gj'],
    '74': ['ui6pkp3ey'],
    '85': ['t4ssrl8m0', '26xwt6pmy'],
    '86': ['vmp83gwvi', 'ju56k7jss'],
    '87': ['c5dydzhv6'],
    '88': ['56wu0ill5', 'af405kt8a'],
    '89': ['y1rfgbrv6'],
    '96': ['wbk1h6ibs'],
    '97': ['t96p87wqn'],
    '98': ['ohwr18hx8'],
    '99': ['n6rkkl96w'],
    '103': ['akiw2porv'],
    '104': ['66z7aanch'],
    '119': ['ih9k0ke9c'],
    '131': ['moazmln10'],
    '132': ['g9vluwl9v'],
    '133': ['4iwaatgnw'],
    '152': ['3m931urju'],
    '201': ['31248yiqq'],
    '213': ['qj5bpdfoy'],
    '214': ['n5ju1a83c'],
    '219': ['twy05rv7y'],
    '223': ['2tzrkccjg'],
    '224': ['fn0aavbbu'],
    '225': ['bpu91pg0l', 'rguvdl5qk'],
    '226': ['vekorqpiq', 'o3248gsj8'],
    '227': ['ldyenf4fm', 'gwyd6nobo'],
    '228': ['4ubccpima'],
    '229': ['pf6c4iivz'],
    '230': ['z3c9cigkk'],
    '231': ['5tizy8d5o'],
    '232': ['r9fdld0qf'],
    '234': ['yooonv21j'],
    '235': ['visnqcj2f'],
    '237': ['mhov971bz'],
    '238': ['0kagr845z'],
    '239': ['xe6652b7y'],
    '240': ['zn2lpvo5o'],
    '241': ['g6g9u3hff'],
    '242': ['xko465hu0'],
    '243': ['v7k8sjyng'],
    '244': ['qe0cyorkp'],
    '245': ['e4l87zajc'],
    '248': ['jaatjooio'],
    '249': ['xxjksc9be'],
    '250': ['bukdravt5'],
    '251': ['h7u9tah2z'],
    '253': ['fht7thlat'],
    '254': ['kt1w0mdoj'],
    '255': ['qhdgtpg0r'],
    '256': ['u6o6m34fa'],
    '257': ['tv0p4vej3', 'mtgrhgvi7'],
    '258': ['krxlgd7xz'],
    '259': ['m81h6hhyi', 'pn6ds4k28', 'i4kntfo6i'],
    '260': ['19hxcr5wk'],
    '261': ['p9cgnw30z'],
    '262': ['7tkgab01x', 'bc9t5dws6'],
    '263': ['945uprmbo', 'es3b2gzqm'],
    '264': ['04nw8z3qa'],
    '265': ['owcds44b4'],
    '266': ['spananuc4'],
    '267': ['ea2aua0om'],
    '268': ['zzday20ds', 'y14khfr86'],
    '269': ['7nd75oewg'],
    '270': ['63p3xahhe', '3ppygwn5j'],
    '271': ['97hk8e0u1'],
    '272': ['3ue4xxt5z'],
    '273': ['gfhpu5icv'],
    '274': ['rx03ru8u8', 'uszewy9c3'],
    '275': ['6frz16gyk'],
    '276': ['2bjlp6akr', '1tr1ckaou'],
    '277': ['fu2j68c0u', 'mm243s9pv'],
    '278': ['zplxg3dcd'],
    '279': ['9whl3ziez'],
    '280': ['aht1u865a'],
    '281': ['d8oy268sz'],
    '282': ['dtn7bauvr'],
    '283': ['dcpoqzj5o', '1ht9pa79g'],
    '284': ['1fifrqph0', '272izo9o7'],
    '286': ['t3lbnk05s', '5hk5k4bbh'],
    '287': ['5w815uovg', 'oto8nms7k'],
    '288': ['8aohx1578', 'sbxu4l7nu'],
    '289': ['5a2izxqmf'],
    '290': ['6h399mfc8', 'carww1elv'],
    '291': ['gqtfqdeq1'],
    '292': ['1uhropo6s', 'zzd9emewu'],
    '293': ['t15ioob8s', '3n8q382a6'],
    '294': ['wktnl5bxq', 'enornjpyx'],
    '295': ['fi58mt715']
  }
}

// Helper methods
export function getLocationById(locationId: EntranceLocationId): EntranceLocation {
  return ENTRANCE_LOCATIONS[locationId];
}

export function getLocationsOnScreen(worldType: WorldType, screenIndex: number): Array<EntranceLocationId> {
  let requiredLocationsOnScreen = SCREEN_DATA[worldType][screenIndex];

  if (requiredLocationsOnScreen === undefined) {
    const errorMessage: string =
      `The given screen of index '${screenIndex}' for worldtype '${worldType}' ` +
      `does not exist (or) does not have any entrances on it`
    ;
    throw new InvalidScreenIndexError(errorMessage);
  }

  return requiredLocationsOnScreen;
}

/* TAGS */
type Tag = {
  name: string;
  editable: boolean;
  locations: {[key in EntranceLocationId]?: true};  // Set of locations
};

export const TAGS: { [key: string]: Tag } = {
  darkRooms: {
    name: "Dark Rooms",
    editable: false,
    locations: {
      "pf6c4iivz": true,  // Old Man Back Entrance Inside
      "z3c9cigkk": true,  // DM Descent Exit Inside
      "5tizy8d5o": true,  // DM Descent Entrance Inside
      "zn2lpvo5o": true,  // DM Ascent Entrance Inside
      "g6g9u3hff": true   // DM Ascent Exit Inside
    }
  }
};
