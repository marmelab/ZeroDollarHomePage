import { expect } from 'chai';
import { githubApi as githubApiFactory } from './githubApi';

describe('github', () => {
    describe('githubApi', () => {
        const githubApi = githubApiFactory({
            issue: (repositoryFullName, pullRequestNumber) => {
                expect(repositoryFullName).to.equal('marmelab/test-repository');
                expect(pullRequestNumber).to.equal(42);

                return {
                    createComment: (options, callback) => {
                        expect(options.body).to.equal('Run you fools!');
                        callback(null);
                    },
                };
            },

            pr: (repositoryFullName, pullRequestNumber) => {
                expect(repositoryFullName).to.equal('marmelab/test-repository');
                expect(pullRequestNumber).to.equal(42);

                return {
                    info: callback => {
                        callback(null, { id: 42 });
                    },
                };
            },
        });

        describe('commentOnPullRequest', () => {
            it('should post a new comment with claim directions', function* commentOnPullRequest() {
                yield githubApi.commentOnPullRequest('marmelab/test-repository', 42, 'Run you fools!');
            });
        });

        describe('loadPullRequest', () => {
            it('should load the correct pull request', function* loadPullRequest() {
                const pr = yield githubApi.loadPullRequest('marmelab/test-repository', 42);
                expect(pr).to.deep.equal({ id: 42 });
            });
        });
    });
});
