const Enum   = require('enum');

const RC                = new Enum (['OK', 'KO']);
const NOTHING           = 'NOTHING';
const Reason            = new Enum ({'None': 0, 'Populate':1, 'Deserialize':2, 'Serialize': 3} );
const AccessType         = new Enum ({'None' : 0, 'Public' : 1, 'Full' : 2 })


exports.RC = RC ;
exports.NOTHING = NOTHING ;
exports.AccessType = AccessType ;
exports.Reason = Reason ;

