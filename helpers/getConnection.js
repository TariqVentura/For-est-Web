var Connection = require('tedious').Connection;  
var config = {  
    server: 'exposerver.database.windows.net',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'sm', //update me
            password: '9u7t90JxXtB9'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'Base_Expo'  //update me
    }
};  
const getConnection = () => {
    const connect = () => new Promise((resolve, reject) => {
        const connectionInstance = new Connection(config);
        connectionInstance.on('connect', (error) => {
            if(!error) {
                resolve(connectionInstance);
            }
            else {
                reject(error);
            }
        });

        connectionInstance.connect();
    });

    return {connect};
};

module.exports = getConnection;