export default function(githubHook, config, handlePullRequestEvent) {
    const github = githubHook(config.githubHook);
    github.listen();

    github.on('pull_request', handlePullRequestEvent);
}
