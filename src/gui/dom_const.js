const Enum = require ('enum');



const input_value   = 'input-value';
const menu_item     = 'menu-item';
const KeyCode       = new Enum ({'F12' : 123, 'F5': 116,'ENTER': 13 });
const DomClass      = new Enum([ input_value, menu_item]);


exports.DomClass    = DomClass;
exports.KeyCode     = KeyCode;
exports.input_value = input_value;
exports.menu_item   = menu_item;