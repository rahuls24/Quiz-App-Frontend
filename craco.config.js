const path = require('path');
module.exports = {
    webpack: {
        alias: {
            '@Page': path.resolve(__dirname, 'src/pages/'),
            '@Type': path.resolve(__dirname, 'src/types/'),
            '@Feature': path.resolve(__dirname, 'src/features/'),
            '@Asset': path.resolve(__dirname, 'src/assets/'),
            '@ReduxStore': path.resolve(__dirname, 'src/app/'),
            '@SharedComponent': path.resolve(
                __dirname,
                'src/shared/components/'
            ),
            '@SharedFunction': path.resolve(__dirname, 'src/shared/functions/'),
            '@CustomHook': path.resolve(__dirname, 'src/shared/hooks/'),
        },
    },
};
