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


/*



module.exports =
{
    name: "skin",
    settings: 
    {
        routes:  
        [
            { path: "/skin" }
        ]
    },

    actions: 
    { 
        async list ( ctx )
        {
            let ids = [];
            
            let id_ctx  = ctx.params.id != undefined ?  ctx.params.id : 1;
            if ( id_ctx.search ('|') != -1 )
                ids = id_ctx.split('|');
            else
                ids.push (id) ;
            console.log ('id : ' +  typeof ids )

            let bb_obj = null;
            let bb_objects = [];
            console.log (ids);

            for ( let i=0; i < ids.length; i++ )
            {
                let id = Number(ids[i]);
                console.log ('for typeof id :' + typeof id + ' id : ' + id)
                bb_obj = Skin.GetFromRecordId( id );

                if ( bb_obj !== Skin.NULL ) { bb_objects.push( bb_obj ); }

                else
                {
                    // Restauration depuis db (deserialization)
                    let result_rows = await Skin.LoadFromDBTable( id );
                    let rows_count = result_rows.length;
                   
                    if ( rows_count == 1 )
                    {
                        let row = result_rows[ 0 ];
                        bb_obj = await Skin.Create(  row,  Konst.Reason.Deserialize );
                        bb_objects.push( bb_obj );
                    }
                    else console.log ('JE SUIS M2CHANT' + rows_count)
                }
            }

            ctx.meta.$responseType = "text/json ; charset=utf-8";
            console.log ( JSON.stringify ( bb_objects ) )
            return bb_objects;          
            //return "Error /stella/skin_sell_order/list";// + rows_count;  
        }, // list


        async update ( ctx )
        {
        }, // update

        async save ( ctx )
        {
            let id = ctx.params.id != undefined ?  ctx.params.id : 1;


            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return "Error /stella/skin/save id= " + id;// + rows_count;  
        }, // save

        async count ( ctx )
        {
            let result = await Skin.GetRecordCount();

            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return result; // + rows_count;  
        } // save
    } // actions list
}; // 'skin_sell_order' service


module.exports =
{
    name: "skin_sell_order",
    settings: 
    {
        routes:  
        [
            { path: "/skin_sell_order" }
        ]
    },

    actions: 
    { 
        async list ( ctx )
        {
            let ids = [];
            
            let id_ctx  = ctx.params.id != undefined ?  ctx.params.id : 1;
            if ( id_ctx.search ('|') != -1 )
                ids = id_ctx.split('|');
            else
                ids.push (id) ;
            console.log ('id : ' +  typeof ids )

            let bb_obj = null;
            let bb_objects = [];
            console.log (ids);

            for ( let i=0; i < ids.length; i++ )
            {
                let id = Number(ids[i]);
                console.log ('for typeof id :' + typeof id + ' id : ' + id)
                bb_obj = SkinSellOrder.GetFromRecordId( id );

                if ( bb_obj !== SkinSellOrder.NULL ) { bb_objects.push( bb_obj ); }

                else
                {
                    // Restauration depuis db (deserialization)
                    let result_rows = await SkinSellOrder.LoadFromDBTable( id );
                    let rows_count = result_rows.length;
                   
                    if ( rows_count == 1 )
                    {
                        let row = result_rows[ 0 ];
                        bb_obj = await SkinSellOrder.Create(  row,  Konst.Reason.Deserialize );
                        bb_objects.push( bb_obj );
                    }
                    else console.log ('JE SUIS M2CHANT' + rows_count)
                }
            }

            ctx.meta.$responseType = "text/json ; charset=utf-8";
            console.log ( JSON.stringify ( bb_objects ) )
            return bb_objects;          
            //return "Error /stella/skin_sell_order/list";// + rows_count;  
        }, // list


        async update ( ctx )
        {
        }, // update

        async save ( ctx )
        {
            let id = ctx.params.id != undefined ?  ctx.params.id : 1;


            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return "Error /stella/skin_sell_order/save id= " + id;// + rows_count;  
        }, // save

        async count ( ctx )
        {
            let result = await SkinSellOrder.GetRecordCount();

            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return result; // + rows_count;  
        } // save
    } // actions list
}; // 'skin_sell_order' service

*/