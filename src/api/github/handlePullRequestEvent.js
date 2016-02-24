export default (commentOnPullRequest) => (repo, ref, data) => {
    if (data.action !== 'close' || !data.pull_request.merged) {
        return;
    }

    commentOnPullRequest(data.repository.full_name, data.number, data.pull_request.user.login);
};
