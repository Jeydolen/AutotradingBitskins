const Enum   = require('enum');

const RC                = new Enum (['OK', 'KO']);
const NULL_RECORD_ID    = 1;
const NOTHING           = 'NOTHING';
const Reason            = new Enum ({'None': 0, 'Populate':1, 'Deserialize':2, 'Serialize': 3, 'Count' : 4, 'Progress' : 5 } );
const AccessType         = new Enum ({'None' : 0, 'Public' : 1, 'Full' : 2 })


exports.RC = RC ;
exports.NULL_RECORD_ID = NULL_RECORD_ID ;
exports.NOTHING = NOTHING ;
exports.AccessType = AccessType ;
exports.Reason = Reason ;

