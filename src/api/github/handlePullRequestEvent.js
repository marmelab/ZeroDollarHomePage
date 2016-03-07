import querystring from 'querystring';

export default (githubApi, config) => (repo, ref, data) => {
    if (data.action !== 'closed' || !data.pull_request.merged) {
        return;
    }

    const link = `${config.frontendUrl}/#/claim?${querystring.stringify({
        repository: data.repository.full_name,
        pr: data.number,
    })}`;
    const appLink = config.frontendUrl;

    githubApi.commentOnPullRequest(data.repository.full_name, data.number, `
Thank you for this pull request @${data.pull_request.user.login} !
You can go to this [page](${link}) to submit the content you'd like to be displayed on [ZeroDollarHomePage](${appLink})`);
};
