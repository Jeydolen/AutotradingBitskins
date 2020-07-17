const PopulateDBCmd = rekwire ('/src/commands/populate_db_cmd.js').PopulateDBCmd;
const BackupDBCmd = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;

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
            PopulateDBCmd.GetSingleton().execute(args);
            return 'Lancement populate';
        }, 
        backup (args) 
        {
            var file_name = args.params.file
            console.log('Backup : ' + file_name);
            BackupDBCmd.GetSingleton().execute(file_name);
            return 'Lancement backup';
        } 
    }
};