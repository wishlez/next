// eslint-disable-next-line @typescript-eslint/no-var-requires
const {version} = require('./package.json');

module.exports = {
    env: {
        VERSION: version
    }
};
