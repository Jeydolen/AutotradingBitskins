
const executeQuery = (db_connection, query) =>
{
    var sql_cmd = query.split(" ");
    var query = db_connection.query
    ( query, 
    function (error, results, fields) 
    {
    if (error)
    {
        console.log ('Le probleme est ici ' + error );

    }
    console.log(sql_cmd[0] + ' completed with success');
        }
    );
};


exports.executeQuery = executeQuery ;