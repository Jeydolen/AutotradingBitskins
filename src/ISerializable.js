const Enum  = require('enum');

const DataFormat = new Enum( [ 'JSON', 'MySQL', 'CSV' ] );

//==================== 'ISerializable' interface class ====================
class ISerializable 
{  
    // Fallback implementation of 'save' service
    //       JSON       FICHIER
    //      MYSQL       CONNEXION ( DB )  
    save( data_format, target ) 
    {     
        throw "ISerializable.save() not implemented";
    } // ISerializable.save()

    // Fallback implementation of 'load' service  
    load( data )
    {
        throw "ISerializable.load() not implemented";
    } // ISerializable.load()
} // 'ISerializable' class

exports.DataFormat      = DataFormat ;
exports.ISerializable   = ISerializable;