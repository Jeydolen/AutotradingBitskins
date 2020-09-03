const CounterArgs = class
{
    constructor ( { type, value, max_value, page_index } )
    {
        this.type = type;
        this.value = value;
        this.max_value = max_value;
        this.page_index = page_index;
    }
}; // CounterArgs class

exports.CounterArgs = CounterArgs;