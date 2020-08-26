const Enum   = require('enum');


const APP_ROOT_PATH = require ('app-root-path');
const DEFAULT_JSON_OUTPUT_FILE  = 'test_output.json' ;
const DEFAULT_JSON_OUTPUT_PATH  = APP_ROOT_PATH + '/data/json/';
const RC                = new Enum (['OK', 'KO']);
const NULL_RECORD_ID    = 0;
const NOTHING           = 'NOTHING';
const Reason            = new Enum ({'None': 0, 'Populate':1, 'Deserialize':2, 'Serialize': 3, 'Count' : 4, 'Progress' : 5 } );
const AccessType         = new Enum ({'None' : 0, 'Public' : 1, 'Full' : 2 })

exports.APP_ROOT_PATH = APP_ROOT_PATH;
exports.DEFAULT_JSON_OUTPUT_PATH = DEFAULT_JSON_OUTPUT_PATH;
exports.DEFAULT_JSON_OUTPUT_FILE = DEFAULT_JSON_OUTPUT_FILE;
exports.RC = RC ;
exports.NULL_RECORD_ID = NULL_RECORD_ID ;
exports.NOTHING = NOTHING ;
exports.AccessType = AccessType ;
exports.Reason = Reason ;

