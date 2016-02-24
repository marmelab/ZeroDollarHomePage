import { expect } from 'chai';
import initializeGithubHook from './initializeGithubHook';

describe('github', () => {
    describe('initializeGithubHook', () => {
        const config = {
            githubHook: {
                host: 'localhost',
                port: 442,
            },
        };

        it('should initialize the hook lib correctly', done => {
            const githubHook = ghConfig => {
                expect(ghConfig).to.deep.equal(config.githubHook);
                done();

                return {
                    listen: () => {},
                    on: () => {},
                };
            };

            initializeGithubHook(githubHook, config);
        });

        it('should listen pull_request events with passed handler', () => {
            const handler = () => {};

            const githubHook = () => {
                return {
                    listen: () => {},
                    on: (event, h) => {
                        expect(event).to.equal('pull_request');
                        expect(h).to.equal(handler);
                    },
                };
            };

            initializeGithubHook(githubHook, config, handler);
        });
    });
});
