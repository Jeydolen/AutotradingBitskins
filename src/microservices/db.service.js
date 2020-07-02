const GUI               = rekwire ('/src/gui/gui.js').GUI;
const EventDispatcher   = rekwire ('/src/event_dispatcher.js').EventDispatcher;

module.exports =
{
    name: "db",
    settings: 
    {
        routes: 
        [
            { path: "/db" }
        ]
    },
    actions: 
    { 
    populate (args) 
        {
            var event = GUI.EVENT.get(GUI.START_POPULATE_DB_EVT);
            console.log('event:' + event.value.toString());
            EventDispatcher.GetSingleton().dispatch(event, null);
            return 1;
        } 
    }
};