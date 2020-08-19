const Service               = require ("moleculer").Service;
const assert                = require ('assert');
const clone                 = require ('clone');



const { TradeUp  }                  = rekwire ('/src/model/trade_up.js') ;
const BitskinsObject                = rekwire ('/src/model/bb_obj.js').BitskinsObject;
const { mapToString, mapToJSON, mapToObj }    = rekwire ('/src/utility.js');


console.log ( TradeUp.name)

class TradeUpService extends Service
{
    constructor(broker) 
    {
        super(broker);

        this.klass = TradeUp ;
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


    // Uniquement via instances (mem) pour le moment 
    // https://www.npmjs.com/package/stringify-object
    list ( ctx ) 
    {
        let id = ctx.params.id != undefined ?  ctx.params.id : 0;
        console.log ('trade_up/list:  id=' + id  );
        let trade_up = this.klass.GetInstanceByIndex( id );
        console.log ('trade_up/list:  name=' + trade_up.getName()  );

        //trade_up.target_siblings = mapToJSON (trade_up.target_siblings);
        let obj_clone = clone ( trade_up );

        let target_siblings_as_JSON = mapToJSON (obj_clone.target_siblings);
        obj_clone.target_siblings = mapToJSON (target_siblings_as_JSON);

        //let test = mapToJSON (obj_clone.target_siblings);
        //let test_map = new Map () 
        //test_map.set ( 'porououtoeuteotepute', 'jesuis une gentiille map' )
        //obj_clone.target_siblings = mapToObj ( test_map );

        ctx.meta.$responseType = "text/json ; charset=utf-8";
        //return target_siblings_as_JSON;
        return obj_clone;   

    } // list()


    async count ( ctx )
    {
        //                                  'db' or 'mem'
        let from_arg = ctx.params.from != undefined ? ctx.params.from : 'mem';
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

        assert ( result != null );
        ctx.meta.$responseType = "text/json ; charset=utf-8"; 
        return result; // + rows_count;  

    } // CountAction()

} // TradeUpService Class

module.exports = TradeUpService;