const Service                   = require ("moleculer").Service;
const assert                    = require ('assert');


const { TradeUp  }              = rekwire ('/src/model/trade_up.js') ;
const { BitskinsObject }        = rekwire ('/src/model/bb_obj.js');
const { MakeTradeUpsFromDBCmd } = rekwire("/src/commands/make_trade_ups_from_db_cmd.js");
const { MoulaSeekCmd }          = rekwire("/src/commands/moula_seek_cmd.js");

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
                extract : this.extract,
                count : this.count,
                moula_seek : this.moulaSeek
            },
        });
    } // constructor


    // Uniquement via instances (mem) pour le moment 
    // https://www.npmjs.com/package/stringify-object
    list ( ctx ) 
    {
        let id = ctx.params.id != undefined ?  ctx.params.id : 'all';
        console.log ('trade_up/list:  id=' + id  );

        let trade_ups = [];
        let trade_up  = null;

        if ( id.constructor.name == String.name)
        {
            id = id.toLowerCase()
            if ( id == 'all')
            {     
                trade_ups = Array.from (this.klass.Instances.values());
                console.log( "trade_ups: " + trade_ups );
            }
            else 
                console.log ( "id non reconnu ( ! all ou d'un entier");
        }
        else
        {
            trade_up = this.klass.GetInstanceByIndex( id );
            trade_ups.push( trade_up );
            console.log ('trade_up/list:  name=' + trade_up.getName()  );
            console.log( "trade_ups: " + trade_ups );
        } 

        ctx.meta.$responseType = "text/json ; charset=utf-8";
        let last_item = trade_ups[ trade_ups.length - 1 ];
        
        let json_data = '[' 
        trade_ups.map( (trade_up) => 
            {
                json_data += JSON.stringify(trade_up.toJSON()) 
                if ( trade_up != last_item )
                    json_data += ',';
            }
        );
        return json_data + ']';

    } // list()


    async extract (ctx)
    {           
        let output = await MakeTradeUpsFromDBCmd.GetSingleton().execute( ctx );
        ctx.meta.$responseType = "text/plain ; charset=utf-8";
        return output;
    } // extract()


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

    } // count()

    async moulaSeek ( ctx )
    {
        if (  TradeUp.Instances.size == 1)
            await this.extract ( ctx );
        
        let result = MoulaSeekCmd.GetSingleton().execute(ctx);


        ctx.meta.$responseType = "text/plain ; charset=utf-8"; 
        return result ;
    }

} // TradeUpService Class

module.exports = TradeUpService;
