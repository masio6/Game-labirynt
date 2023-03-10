"use strict";

/*
 * Reglas:
 * El final de cada nivel debe ser el inicio del siguiente
 */

const emojis = {
  '-': ' ',
  'O': '๐ช',
  'X': '๐ง',
  'I': '๐งต',
   'M':' ๐ธ ',
  'PLAYER': '๐ค ',
  'GAME_OVER': '๐',
  'WIN': '๐',
  'HEART': 'โค๏ธ',
  'S':'๐ฆ',
   'D':'๐',

};

const maps = [];
maps.push(`
  I-----XXXX
  XXS-X-XXXX
  -XX-X-XXXX
  -XS-S--XXX
  -X--XX-SXX
  -X-SXX--XX
  -S---XS-XX
  -XX-X---MX
  ------X--X
  OXXXXXXXXX
`);
maps.push(`
  O-------XX
  X--XXXX-MX
  XX----X--X
  X--XX-SXXX
  X-SXX----X
  X-XSXS-SXX
  X---XX-MXX
  XX---X--SX
  XXXS---IXX
  XXXXXXXXXX
  `);
maps.push(`
  DI----XXXX
  XXXXM-XXXX
  XX----SXXX
  XX-MXXMXXX
  XS-----XXX
  XXXXXS-XXX
  XX-----SXX
  XX-MXXXXXX
  XS-----OXX
  XXXXXXXXXX
`);