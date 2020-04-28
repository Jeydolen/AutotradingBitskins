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

const test = () => 
{
    var args = 
    {
        'itemset' : 'hello'
    };

    var rule = new ItemsetRule (null);
    rule.check (args);
};
test();