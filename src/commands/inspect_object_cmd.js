const _ = require('lodash');

const knex                   = rekwire ('/src/bb_database.js').knex_conn;
const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js');
const Command                = rekwire ('/src/commands/command.js').Command;
const TradeUp = rekwire ('/src/model/trade_up.js').TradeUp;


class InspectObjectCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
        this.output = null;
    } // constructor


    async execute ( ctx )
    {
        let source_and_target_rows= await this.extractSourceAndTargetRowsFromDB( ctx );

        let source_rows = source_and_target_rows.sources;
        let target_rows = source_and_target_rows.targets;

        let potential_profitable_trade_ups = this.extractPotentialProfitableTradeUps (  source_rows, target_rows );
        let siblings_target_of_source_decade = this.extractSiblingTargetsOfSourceDecade ( ctx, target_rows, potential_profitable_trade_ups );
        //this.createTradeUps(ctx, potential_profitable_trade_ups );

        return  this.output;
    } // execute()

} // InspectObjectCmd
exports.MakeTradeUpsFromDBCmd = MakeTradeUpsFromDBCmd;