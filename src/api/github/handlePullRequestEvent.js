import querystring from 'querystring';

export default (githubApi, config) => (repo, ref, data) => {
    if (data.repository.private) {
        return;
    }

    if (data.action !== 'closed' || !data.pull_request.merged) {
        return;
    }

    const link = `${config.frontendUrl}/#/claim?${querystring.stringify({
        repository: data.repository.full_name,
        pr: data.number,
    })}`;
    const appLink = 'http://marmelab.com/ZeroDollarHomepage/';

    githubApi.commentOnPullRequest(data.repository.full_name, data.number, `
Thanks @${data.pull_request.user.login} for contributing to marmelab open-source projects!
As a sign of our gratitude, you can publish an image to advertise your brand on the marmelab website for a whole day.
Head to [this page](${link}) to submit your image. It will appear on [Zero Dollar Homepage](${appLink}), powered by blockchain technology.`);
};
