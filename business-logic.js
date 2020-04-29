const MxI              = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const ISerializable    = require('./ISerializable.js').ISerializable;
const db = require ('./db.js');


class BusinessRule 
{   
    constructor (children)
    {
        this.children = children ;
        this.checked = false;
    }

    check (args) 
    {
        this.checked = false ;    
        return this.checked ;
    }

}


class ItemsetRule extends BusinessRule 
{
    check (args)
    {
        console.log ('type de args : ' + typeof args );
        if (! args instanceof Map)
        {
           console.log ("Starfoullah c pa une map")
           return false ;
        }
        console.log ('Reçu mon général');
    }
} 


//-------------------------------------------------------------
//-------------------- SkinSellOrder class --------------------
//-------------------------------------------------------------
// class SkinSellOrder extends MxI.$Implementation(MxI.$Object).$with(ISerializable) 
class SkinSellOrder
{   // 1) Valeur db 2) Valeur JSON
    constructor(db_connection, input_item) 
    {
        this.db_connection = db_connection ;
        this.id_str = input_item.item_id;
        this.market_name = input_item.market_hash_name;
        this.item_rarity = this.computeRarityID(input_item.item_rarity);
        this.state = this.computeStateID (input_item.float_value);
      //  this.image_url = input_item.image;
        this.price = input_item.price;
        this.recommanded_price = input_item.suggested_price;
    }
    

    computeStateID (value) 
    {
      var id = 0;
      if      ( value >= 0.45  &&  value < 1.00 )
        id = 1
      else if ( value >= 0.38  &&  value < 0.45 )
        id = 2
      else if ( value >= 0.15  &&  value < 0.38 )
        id = 3
      else if ( value >= 0.07  &&  value < 0.15 )
        id = 4
      else if ( value >= 0  &&  value < 0.07 )
        id = 5
      return id;
    }

    computeRarityID (value)
    {
      var id = 0;
      if      ( value == 'Consumer Grade' )
        id = 1
      else if ( value == 'Industrial Grade' )
        id = 2
      else if ( value == 'Mil-Spec Grade' )
        id = 3
      else if ( value == 'Restricted' )
        id = 4
      else if ( value == 'Classified' )
        id = 5
      else if ( value == 'Covert' )
        id = 6
      else if ( value == 'Contraband' )
        id = 7
      return id;
    }

    save(args) 
    {
      console.log("ISerializable(SkinSellOrder).load()");
      if (! args instanceof Map)
      {
         console.log ("args c pa une map")
         return false ;
      }
    } // ISerializable.save()
    
    load(args)
    {
        console.log("ISerializable(SkinSellOrder).load()");
        if (! args instanceof Map)
        {
           console.log ("args c pa une map")
           return false ;
        }
    } // ISerializable.load()
} // SkinSellOrder class 
exports.SkinSellOrder = SkinSellOrder ;
//-------------------- SkinSellOrder class --------------------

class SkinSet
{
    constructor(db_connection, name) 
    {
        this.db_connection = db_connection ;
        this.name = name ;
    }
    
    getName () 
    {
        return this.name ;
    }
    
    static GetInstanceCount  ()
    {
        var instance_count = Object.keys(SkinSet.Instances).length ; 
        return instance_count;
    }

    static Create (input_item)
    {
        var new_order = undefined ;

        if ( SkinSet.Instances === undefined ) 
        {
            console.log ('Dictionnaire init') ;
            SkinSet.Instances = {} ;
        }

        //var name = input_item.tags.itemset ;
        var name = input_item ;


        if (SkinSet.Instances[name] === undefined )
        {
            console.log ('Détection nouvel élément') ;
            new_order = new SkinSet (name);
            SkinSet.Instances[name] = new_order ;
        }
        else 
        {
            console.log ('Element déja créé : ' + name );
            new_order = SkinSet.Instances[name] ;
        }
        return new_order ;
    }
} // SkinSet class
SkinSet.Instances ;
exports.SkinSet = SkinSet ;


const test = () => 
{
    var set1 = SkinSet.Create ('bjr');
    var set2 = SkinSet.Create ('Aurevoir');
    var set3 = SkinSet.Create ('bjr');
    console.log (SkinSet.GetInstanceCount() );
}

test();