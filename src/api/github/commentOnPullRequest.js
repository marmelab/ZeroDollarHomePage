export default (githubApi, config) => (repositoryFullName, pullRequestNumber, authorUserName) => {
    const client = githubApi.client(config.github);
    const ghissue = client.pr(repositoryFullName, pullRequestNumber);
    const link = `${config.frontendUrl}/claim?pr=${pullRequestNumber}`;
    const appLink = config.frontendUrl;

    ghissue.createComment({
        body: `
Thank you for this pull request @${authorUserName} !
You can go to this [page](${link}) to submit the content you'd like to be displayed on [ZeroDollarHomePage](${appLink})`,
    }, err => {
        console.error(err);
    });
};
