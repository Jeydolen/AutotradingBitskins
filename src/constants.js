const Enum   = require('enum');
const chalk  = require ('chalk');

const SQ = "\x27";

const RC = new Enum (['OK', 'KO']);

const NOTHING = 'NOTHING';

const DEFAULT_NAMES = new Enum (['NOTHING']);

const PAGE_INDEX_START = 80;

const getFunctionName = (f) =>
{
    var ret = f.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
};


exports.RC = RC ;
exports.SQ = SQ ;
exports.NOTHING = NOTHING ;
exports.PAGE_INDEX_START = PAGE_INDEX_START ;
exports.DEFAULT_NAMES = DEFAULT_NAMES ;
exports.getFunctionName = getFunctionName ;

