const Enum   = require('enum');

const RC                = new Enum (['OK', 'KO']);
const NOTHING           = 'NOTHING';
const DEFAULT_NAMES     = new Enum (['NOTHING']);
const Reason            = new Enum ({'None': 0, 'Populate':1, 'Deserialize':2, 'Serialize': 3} );


const getFunctionName = (f) =>
{
    var ret = f.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}; // getFunctionName()


exports.RC = RC ;
exports.NOTHING = NOTHING ;
exports.DEFAULT_NAMES = DEFAULT_NAMES ;
exports.getFunctionName = getFunctionName ;
exports.Reason = Reason ;

