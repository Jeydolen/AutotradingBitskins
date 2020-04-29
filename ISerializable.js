const MxI = require ('mixin-interface-api/src/mixin_interface_api.js').MxI;
const Enum = require('enum');


// npmjs.com/package/enum
const MEDIA_TYPE         = new Enum(['DB', 'FILE']);
const MEDIA              = new Enum(['DB_NAME', 'FILE_PATH']);
const FILE_TYPE          = new Enum(['JSON', 'SQL' ]);
const SERIALIZATION_ARGS = new Enum(['FILE_PATH', 'MEDIA_TYPE', 'FILE_TYPE']);

//==================== 'ISerializable' interface class ====================
class ISerializable extends MxI.$Interface(MxI.$IBaseInterface) 
{  
    // Fallback implementation of 'save' service
    save(args) 
    {
        MxI.$raiseNotImplementedError(ISerializable, this);
    } // ISerializable.save()

    load(args)
    {
        MxI.$raiseNotImplementedError (ISerializable, this);
    } // ISerializable.load()

} // 'ISerializable' class

MxI.$setAsInterface(ISerializable).$asChildOf(MxI.$IBaseInterface);
  
exports.ISerializable = ISerializable;
exports.MEDIA_TYPE = MEDIA_TYPE;
exports.MEDIA = MEDIA ;
exports.FILE_TYPE = FILE_TYPE ;
exports.SERIALIZATION_ARGS = SERIALIZATION_ARGS ;