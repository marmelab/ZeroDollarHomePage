import { expect } from 'chai';
import sinon from 'sinon';
import handlePullRequestEventFactory from './handlePullRequestEvent';

describe('github', () => {
    describe('handlePullRequestEventFactory', () => {
        const config = {
            frontendUrl: 'http://theshire.com',
        };

        const githubApi = {
            commentOnPullRequest: sinon.stub(),
        };

        const handlePullRequestEvent = handlePullRequestEventFactory(githubApi, config);

        it('shouldn\'t handle event with action different than \'close\'', () => {
            handlePullRequestEvent(undefined, undefined, {
                action: 'open',
            });

            expect(githubApi.commentOnPullRequest.called).to.be.false;
        });

        it('shouldn\'t handle pull request which haven`t been merged', () => {
            handlePullRequestEvent(undefined, undefined, {
                action: 'close',
                pull_request: {
                    merged: false,
                },
            });

            expect(githubApi.commentOnPullRequest.called).to.be.false;
        });

        it('should handle closed pull requests and comment on it', () => {
            handlePullRequestEvent(undefined, undefined, {
                action: 'close',
                repository: { full_name: 'theshire/bagend' },
                number: 42,
                pull_request: {
                    merged: true,
                    user: { login: 'frodo'},
                },
            });

            expect(githubApi.commentOnPullRequest.firstCall.args[0]).to.equal('theshire/bagend');
            expect(githubApi.commentOnPullRequest.firstCall.args[1]).to.equal(42);
            expect(githubApi.commentOnPullRequest.firstCall.args[2]).to.contains('@frodo');
            expect(githubApi.commentOnPullRequest.firstCall.args[2]).to.contains('http://theshire.com/claim?repository=theshire%2Fbagend&pr=42');
        });
    });
});
