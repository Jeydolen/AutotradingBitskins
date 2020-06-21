const Registry             = rekwire ('/src/registry.js').Registry ;

class CommandRegistry extends Registry
{ 
    constructor (name) { super ( name ); }
}
exports.CommandRegistry = CommandRegistry;