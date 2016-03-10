const messagesForCodes = {
    0: 'Ok', // Ok,
    1: 'Invalid pull request identifier', // InvalidPullRequestId,
    2: 'Invalid pull request author name', // InvalidAuthorName,
    3: 'Request not found', // RequestNotFound,
    4: 'Empty queue', // EmptyQueue
    5: 'Pull request already claimed', // PullRequestAlreadyClaimed
};

export default (code) => messagesForCodes[code];
