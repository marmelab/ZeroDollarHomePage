import { expect } from 'chai';
import sinon from 'sinon';
import handlePullRequestEventFactory from './handlePullRequestEvent';

describe('github', () => {
    describe('handlePullRequestEventFactory', () => {
        it('shouldn\'t handle event with action different than \'close\'', () => {
            const commentOnPullRequest = sinon.spy();

            handlePullRequestEventFactory(commentOnPullRequest)(undefined, undefined, {
                action: 'open',
            });

            expect(commentOnPullRequest.called).to.be.false;
        });

        it('shouldn\'t handle pull request which haven`t been merged', () => {
            const commentOnPullRequest = sinon.spy();

            handlePullRequestEventFactory(commentOnPullRequest)(undefined, undefined, {
                action: 'close',
                pull_request: {
                    merged: false,
                },
            });

            expect(commentOnPullRequest.called).to.be.false;
        });

        it('should handle closed pull requests and comment on it', done => {
            const commentOnPullRequest = (repositoryFullName, pullRequestNumber, authorUserName) => {
                expect(repositoryFullName).to.equal('marmelab/test-repository');
                expect(pullRequestNumber).to.equal(42);
                expect(authorUserName).to.equal('frodo');
                done();
            };

            handlePullRequestEventFactory(commentOnPullRequest)(undefined, undefined, {
                action: 'close',
                repository: { full_name: 'marmelab/test-repository' },
                number: 42,
                pull_request: {
                    merged: true,
                    user: { login: 'frodo'},
                },
            });
        });
    });
});
