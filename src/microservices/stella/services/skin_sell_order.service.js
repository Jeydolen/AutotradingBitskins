const Service = require("moleculer").Service;
const assert  = require ('assert');

const { SkinSellOrder  }    = rekwire ('/src/model/skin_sell_order.js') ;

const obj2string            = rekwire ('/src/utility.js').objToString
const BitskinsObject        = rekwire ('/src/model/bb_obj.js').BitskinsObject
const Konst                 = rekwire ('/src/constants.js');

// https://github.com/moleculerjs/moleculer-web/blob/master/examples/rest/index.js
// https://moleculer.services/docs/0.14/services.html#ES6-Classes


class SkinSellOrderService extends Service
{
    constructor(broker) 
    {
        super(broker);

        this.klass = SkinSellOrder ;
        this.klass_name = BitskinsObject._GetTableName ( this.klass.name )

        console.log ( 'Class : ' + this.klass.name + ', name: ' + this.klass_name)

        this.parseServiceSchema
        ({
            name: this.klass_name,
            settings: 
            {
                routes:  
                [
                    { path: "/" + this.klass_name }
                ]
            },
            
            actions: 
            {
                list: this.list, 

                count : this.count
               //update: this.update,

               /*
                save: this.save,
                {
                    let id = ctx.params.id != undefined ?  ctx.params.id : 1;
                    ctx.meta.$responseType = "text/json ; charset=utf-8";            
                    return "Error /stella/skin/save id= " + id;// + rows_count;  
                }, // save
                */
        

            },
        });
    } // constructor


    async list ( ctx ) 
    {
        let ids = [];
                    
        let id_ctx  = ctx.params.id != undefined ?  ctx.params.id : '1';
        let access_type_arg =  ctx.params.access_type != undefined ?  ctx.params.access_type : 'Public';
        let access_type = Konst.AccessType.get ( access_type_arg );
        assert ( typeof id_ctx == 'string', typeof id_ctx )
        console.log ( id_ctx )
        console.log ( access_type );

        if ( id_ctx.search ('|') != -1 )
            ids = id_ctx.split('|');
        else
            ids.push (id) ;
        console.log ('ids : ' +  JSON.stringify ( ids ) )

        let bb_objects = await BitskinsObject.GetObjectsFromRecordIDs( ids, this.klass );
        
        ctx.meta.$responseType = "text/json ; charset=utf-8";
        return bb_objects;   
              
        //return "Error /stella/" + this.klass + "_sell_order/list";// + rows_count; 

    } // list()

    async count ( ctx )
    {
        //                                  'db' or 'mem'
        let from_arg = ctx.params.from != undefined ? ctx.params.from : 'db';
        let result = null;
        if ( from_arg == 'db' )
            result = await this.klass.GetRecordCount();
        else if ( from_arg == 'mem')
            result = this.klass.GetInstanceCount()
        else 
        {
            result = NaN;
            console.log (' From arg is unknown ' + from_arg)
        }

        assert ( result != null )
        ctx.meta.$responseType = "text/json ; charset=utf-8"; 
        return result; // + rows_count;  

    } // CountAction()

} // SkinSellOrderService Class

module.exports = SkinSellOrderService;


