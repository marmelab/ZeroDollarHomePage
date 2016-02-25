import path from 'path';

export default function() {
    return {
        root: path.resolve(__dirname + '/..'),
        alias: {
            ethereum: 'src/ethereum',
            isomorphic: 'src/isomorphic',
        },
        extensions: ['', '.js'],
    };
}
