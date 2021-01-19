import Constants from 'expo-constants';

const ENV = {
    dev: {
        apiUrl: 'ws://02a85eb2.ngrok.io/websocket'
        // apiUrl: 'ws://142.93.55.27:3000/websocket'
    },
    prod: {
        apiUrl: 'ws://142.93.55.27:3000/websocket'
    }
}

function getEnvVars(env = '') {
    // if (env === null || env === undefined || env === '') return ENV.dev;
    if (env === null || env === undefined || env === '') return ENV.prod;
    if (env.indexOf('dev') !== -1) return ENV.dev;
    if (env.indexOf('prod') !== -1) return ENV.prod;
}


export default getEnvVars(Constants.manifest.releaseChannel)