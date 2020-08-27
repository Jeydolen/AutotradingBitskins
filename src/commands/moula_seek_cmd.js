const _                      = require('lodash');
const assert                 = require ('assert');

const fs                     = require('fs');
const { data } = require('jquery');

const knex                   = rekwire ('/src/bb_database.js').knex_conn;
const Konst                  = rekwire ('/src/constants.js');
const SkinSet                = rekwire ('/src/model/skin_set').SkinSet;
const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js');
const Command                = rekwire ('/src/commands/command.js').Command;
const TradeUp                = rekwire ('/src/model/trade_up.js').TradeUp;
const { DataFormat }         = rekwire ('/src/ISerializable.js');
const { BB_Database }        = rekwire ('/src/bb_database.js')
const db                     = rekwire ('/src/db.js');


class MoulaSeekCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
        this.output = null;
    } // constructor

    computeProfit ( trade_up )
    {
        let total_investment = 0.00;
        trade_up.source_decade.map ( (source_sell_order) => { total_investment += source_sell_order.price })

        let upgrades_count = Array.from ( trade_up.target_siblings.keys() ).length;
        //trade_up.profit      = ( target_row.price - total_investment )/ total_investment * 100.00;
        
        let total_profit = 0;
        let total_profit_percent = 0;
        let total_profit_euro    = 0;
        if ( upgrades_count != 0 )
        {
            let cheapest_target_obj_by_skin_id = new Map();

            trade_up.target_siblings.forEach ( (target_siblings_by_skin_id, skin_id) => cheapest_target_obj_by_skin_id.set ( skin_id, target_siblings_by_skin_id[0]) );

            Array.from ( cheapest_target_obj_by_skin_id.values() ).map ( (cheapest_target_obj) => total_profit += cheapest_target_obj.price );

            total_profit_percent = ( ( ( total_profit / upgrades_count )  - total_investment ) * 100.00 ) / total_investment ;
            total_profit_euro    =   ( total_profit / upgrades_count )  - total_investment  ;
        } 
        return "\n Upgrades: " + upgrades_count + ": investment = " + total_investment.toFixed(2) + ' profit in euro:' + total_profit_euro.toFixed(2) + ' € profit in % ' + total_profit_percent.toFixed(2) ;
    }

    execute ( ctx )
    {      
        let result = null;
        let total_investments = [];

        Array.from( TradeUp.Instances.values()).map (
            ( trade_up ) => 
            {
                if (trade_up == TradeUp.NULL) return;
                console.log( "trade_up: " + trade_up.name );
                let total_investment = this.computeProfit ( trade_up );
                console.log( "total_investment: " + total_investment)
                total_investments.push( total_investment )
            })

        return "TradeUps count: " + total_investments;
    } // execute()


} // MoulaSeekCmd
exports.MoulaSeekCmd = MoulaSeekCmd;