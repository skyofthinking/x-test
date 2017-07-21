const AV = require('leancloud-storage');

const APP_ID = 'WNoOM5jJQdlFQ03xc3ya0FrA-gzGzoHsz';
const APP_KEY = '4ocs6shawkdWXeH8LMhg0cSt';

function initRealLeanCloud() {
    const appId = process.env.LEAN_CLOUD_APP_ID;
    const appKey = process.env.LEAN_CLOUD_APP_KEY;
    AV.init({ appId, appKey });
}

function initFakeLeanCloud() {
    const appId = APP_ID;
    const appKey = APP_KEY;
    let url = process.env.FAKE_LEANCLOUD_URL;
    if (!url) {
        // eslint-disable-next-line no-console
        console.warn(`
        use default fake-leancloud-url http://localhost:3001
        make sure you have start the fake-leancloud-auth server
        at the right port locally. If you want to use another one,
        please specify the environmet variable FAKE_LEANCLOUD_URL
    `);
        url = 'http://localhost:3001';
    }
    // eslint-disable-next-line no-underscore-dangle
    AV._config.APIServerURL = url;
    AV.init({ appId, appKey });
}

function initLeanCloud() {
    // if (process.env.NODE_ENV === 'production') {
    //     initRealLeanCloud();
    // } else {
    //     initFakeLeanCloud();
    // }
    const appId = APP_ID;
    const appKey = APP_KEY;
    AV.init({ appId, appKey });
}

module.exports = initLeanCloud;