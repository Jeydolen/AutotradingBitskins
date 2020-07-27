const Enum  = require('enum');

const DataFormat = new Enum( [ 'Json', 'MySQL', 'CSV' ] );

//==================== 'ISerializable' interface class ====================
class ISerializable 
{  
    // Fallback implementation of 'save' service  
    save( data_format, data  ) 
    {     
        throw "ISerializable.save() not implemented";
    } // ISerializable.save()

    // Fallback implementation of 'load' service  
    async load( data )
    {
        throw "ISerializable.load() not implemented";
    } // ISerializable.load()
} // 'ISerializable' class

exports.DataFormat      = DataFormat ;
exports.ISerializable   = ISerializable;