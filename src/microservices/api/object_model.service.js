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
                    var id = ctx.params.id != undefined ?  ctx.params.id : 1;
                    ctx.meta.$responseType = "text/json ; charset=utf-8";            
                    return "Error /stella/skin/save id= " + id;// + rows_count;  
                }, // save
                */
        

            },
        });
    } // constructor

    async list ( ctx ) 
    {
        var ids = [];
                    
        var id_ctx  = ctx.params.id != undefined ?  ctx.params.id : '1';
        assert ( typeof id_ctx == 'string', typeof id_ctx )
        console.log ( id_ctx )
        if ( id_ctx.search ('|') != -1 )
            ids = id_ctx.split('|');
        else
            ids.push (id) ;
        console.log ('id : ' +  typeof ids )

        var bb_obj = null;
        var bb_objects = [];
        console.log (ids);

        for ( var i=0; i < ids.length; i++ )
        {
            var id = Number(ids[i]);
            console.log ('for typeof id :' + typeof id + ' id : ' + id)
            bb_obj = this.klass.GetFromRecordId( id );

            if ( bb_obj !== this.klass.NULL ) { bb_objects.push( bb_obj ); }

            else
            {
                // Restauration depuis db (deserialization)
                var result_rows = await this.klass.LoadFromDBTable( id );
                var rows_count = result_rows.length;
                
                if ( rows_count == 1 )
                {
                    var row = result_rows[ 0 ];
                    bb_obj = await this.klass.Create(  row,  Konst.Reason.Deserialize );
                    bb_objects.push( bb_obj );
                }
                else console.log ('JE SUIS M2CHANT' + rows_count)
            }
        }

        ctx.meta.$responseType = "text/json ; charset=utf-8";
        return bb_objects;          
        //return "Error /stella/" + this.klass + "_sell_order/list";// + rows_count; 

    } // list()

    async count ( ctx)
    {
        var result = await this.klass.GetRecordCount();

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
            var ids = [];
            
            var id_ctx  = ctx.params.id != undefined ?  ctx.params.id : 1;
            if ( id_ctx.search ('|') != -1 )
                ids = id_ctx.split('|');
            else
                ids.push (id) ;
            console.log ('id : ' +  typeof ids )

            var bb_obj = null;
            var bb_objects = [];
            console.log (ids);

            for ( var i=0; i < ids.length; i++ )
            {
                var id = Number(ids[i]);
                console.log ('for typeof id :' + typeof id + ' id : ' + id)
                bb_obj = Skin.GetFromRecordId( id );

                if ( bb_obj !== Skin.NULL ) { bb_objects.push( bb_obj ); }

                else
                {
                    // Restauration depuis db (deserialization)
                    var result_rows = await Skin.LoadFromDBTable( id );
                    var rows_count = result_rows.length;
                   
                    if ( rows_count == 1 )
                    {
                        var row = result_rows[ 0 ];
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
            var id = ctx.params.id != undefined ?  ctx.params.id : 1;


            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return "Error /stella/skin/save id= " + id;// + rows_count;  
        }, // save

        async count ( ctx )
        {
            var result = await Skin.GetRecordCount();

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
            var ids = [];
            
            var id_ctx  = ctx.params.id != undefined ?  ctx.params.id : 1;
            if ( id_ctx.search ('|') != -1 )
                ids = id_ctx.split('|');
            else
                ids.push (id) ;
            console.log ('id : ' +  typeof ids )

            var bb_obj = null;
            var bb_objects = [];
            console.log (ids);

            for ( var i=0; i < ids.length; i++ )
            {
                var id = Number(ids[i]);
                console.log ('for typeof id :' + typeof id + ' id : ' + id)
                bb_obj = SkinSellOrder.GetFromRecordId( id );

                if ( bb_obj !== SkinSellOrder.NULL ) { bb_objects.push( bb_obj ); }

                else
                {
                    // Restauration depuis db (deserialization)
                    var result_rows = await SkinSellOrder.LoadFromDBTable( id );
                    var rows_count = result_rows.length;
                   
                    if ( rows_count == 1 )
                    {
                        var row = result_rows[ 0 ];
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
            var id = ctx.params.id != undefined ?  ctx.params.id : 1;


            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return "Error /stella/skin_sell_order/save id= " + id;// + rows_count;  
        }, // save

        async count ( ctx )
        {
            var result = await SkinSellOrder.GetRecordCount();

            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return result; // + rows_count;  
        } // save
    } // actions list
}; // 'skin_sell_order' service

*/