const assert            = require ('assert');

const BitskinsObject    = require ('./bb_obj.js').BitskinsObject;

const LOG_LEVEL         = require ('./bb_log.js').LOG_LEVEL; 
const konsole           = require ('./bb_log.js').konsole ;

const NULL_AGENT = "NULL_AGENT";



class Agent extends BitskinsObject
{
    static Instances    = new Map();
    static NULL         = Agent.GetNullObject();


    constructor(arg) 
    {
        super (arg);
    
        if ( arg == NULL_AGENT )
            this.name = NULL_AGENT ;
        else 
            this.name = Agent.ExtractName(arg) ; 

        this.item_type = arg.item_type;
        this.table = 'agent';

    } // constructor


    static ExtractName( input_item )
    {
        assert (input_item != undefined);
        var name        = NULL_AGENT;
        var item_type   = Agent.ExtractType( input_item );

        if ( item_type == AGENT_TYPE )
        {
            if ( input_item.market_hash_name.search('|') != -1)
            {
               var parts = input_item.market_hash_name.split('|');
               name = parts[0] + parts[1];
            }
        }
        else
            konsole.error ("KEKETUFOU LA (sticker.js) item_type: " + item_type);
        return item_type;
    } // ExtractName()
    
  
    static GetNullObject() 
    {
        if (Agent.NULL == undefined)
            Agent.NULL = new Agent(NULL_AGENT);
        return Agent.NULL;
    } // GetNullObject() 


    static GetSticker (name)
    {
        Agent.GetNullObject();
  
        var sticker = Agent.Instances.get (name);
        if (sticker != undefined)   return sticker;
        else                        return Agent.NULL;
    } // GetWeapon()
    
    

    static GetInstanceCount  ()
    {
        var instance_count = Agent.Instances.size ;  // Map !!
        konsole.log("Agent.GetInstanceCount:" + instance_count, LOG_LEVEL.OK);
        return instance_count;
    } // GetInstanceCount()


    static Create ( input_item )
    {
        assert(input_item != undefined);

        var item_type = Agent.ExtractType( input_item );
        assert(item_type == AGENT_TYPE);
        
        var name = Agent.ExtractName( input_item);
        var agent_obj = Agent.GetNullObject() ; 


        if ( Agent.Instances.get( name )  == undefined  || Agent.Instances.get (name) === undefined )
        {
            konsole.log ("name : " + JSON.stringify(name)) ;
            konsole.log ('Détection nouveau Agent', LOG_LEVEL.OK) ;

            agent_obj = new Agent ( input_item );

            Agent.Instances.set( name, agent_obj );
            konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + Agent.Instances.size, LOG_LEVEL.OK) ;

        }
        else 
        {
            //konsole.log ('Agent déja créé : ' + name, LOG_LEVEL.WARNING );
            agent_obj = Agent.Instances.get( name );
            agent_obj._is_just_created = false; 
        }

        return agent_obj ;
    } // Create()

} // Agent class
exports.Agent = Agent ;
//----------------------- Agent class -----------------------