const GUI               = rekwire ('/src/gui/gui.js').GUI;
const EventDispatcher   = rekwire ('/src/event_dispatcher.js').EventDispatcher;

module.exports =
{
    name: "help",
    settings: 
    {
        routes: 
        [
            { path: "/help" }
        ]
    },
    actions: 
    { 
        help(args)
        {
            var msg = 'Je suis ton pere !'
            return msg;
        }
    }
};