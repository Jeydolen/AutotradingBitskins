const Enum   = require('enum');
const APP_ROOT_PATH = require ('app-root-path');

// Attention avec les skins qui n'ont PAS de skin_set ( eg : Couteau )
const NULL_RECORD_ID    = 1;


const NOTHING               = 'NOTHING';
const Reason                = new Enum ({'None': 0, 'Populate':1, 'Deserialize':2, 'Serialize': 3, 'Count' : 4, 'Progress' : 5 } );
const AccessType            = new Enum ({'None' : 0, 'Public' : 1, 'Full' : 2 })
const DEFAULT_JSON_OUTPUT_FILE  = 'test_output.json' ;
const DEFAULT_JSON_OUTPUT_PATH  = APP_ROOT_PATH + '/data/json/';
const RC                    = new Enum (['OK', 'KO']);

exports.APP_ROOT_PATH = APP_ROOT_PATH;
exports.DEFAULT_JSON_OUTPUT_PATH = DEFAULT_JSON_OUTPUT_PATH;
exports.DEFAULT_JSON_OUTPUT_FILE = DEFAULT_JSON_OUTPUT_FILE;
exports.RC = RC ;
exports.NULL_RECORD_ID = NULL_RECORD_ID ;
exports.NOTHING = NOTHING ;
exports.AccessType = AccessType ;
exports.Reason = Reason ;

