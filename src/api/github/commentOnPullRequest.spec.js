import { expect } from 'chai';
import commentOnPullRequestFactory from './commentOnPullRequest';

describe('github', () => {
    describe('commentOnPullRequest', () => {
        it('should post a new comment with claim directions', done => {
            const config = {
                github: 'api_key',
                frontendUrl: 'http://marmelab.com',
            };

            const githubApi = {
                client: ghConfig => {
                    expect(ghConfig).to.equal('api_key');
                    return {
                        pr: (repositoryFullName, pullRequestNumber) => {
                            expect(repositoryFullName).to.equal('marmelab/test-repository');
                            expect(pullRequestNumber).to.equal(42);

                            return {
                                createComment: (options) => {
                                    expect(options.body).to.contains('@frodo');
                                    expect(options.body).to.contains('[page](http://marmelab.com/claim?pr=42)');
                                    expect(options.body).to.contains('http://marmelab.com');
                                    done();
                                },
                            };
                        },
                    };
                },
            };

            commentOnPullRequestFactory(githubApi, config)('marmelab/test-repository', 42, 'frodo');
        });
    });
});
