const execQuery = require('../helpers/execQuery')
const TYPES = require('tedious').TYPES

const getUser = (usuario) => {
    const query = `
        SELECT * FROM [dbo].[usuarios]
        WHERE usuario = @usuario
    `;

    const parameters = [
        {name: 'usuario', type: TYPES.UniqueIdentifier, value: usuario},
    ];

    return execQuery.execReadCommand(query, parameters);
};

module.exports  = {
    getUser
}