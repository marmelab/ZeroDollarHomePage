import octonode from 'octonode';

export const githubApi = client => {
    return {
        commentOnPullRequest: (repositoryFullName, pullRequestNumber, body) => {
            return new Promise((resolve, reject) => {
                client.issue(repositoryFullName, pullRequestNumber).createComment({
                    body,
                }, (err) => {
                    if (err) return reject(err);

                    resolve();
                });
            });
        },

        loadPullRequest: (repositoryFullName, pullRequestNumber) => {
            return new Promise((resolve, reject) => {
                client.pr(repositoryFullName, pullRequestNumber).info((err, response) => {
                    if (err) return reject(err);

                    resolve(response);
                });
            });
        },

        loadUser: () => {
            return new Promise((resolve, reject) => {
                client.me().info((err, response) => {
                    if (err) return reject(err);

                    resolve(response);
                });
            });
        },
    };
};

export default (config) => githubApi(octonode.client(config.github));
