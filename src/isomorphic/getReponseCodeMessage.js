const messagesForCodes = {
    0: 'Ok', // Ok,
    1: 'Invalid pull request identifier', // InvalidPullRequestId,
    2: 'Invalid pull request author name', // InvalidAuthorName,
    3: 'Invalid image url', // InvalidImageUrl,
    4: 'Request not found', // RequestNotFound,
    5: 'Empty queue', // EmptyQueue
};

export default (code) => messagesForCodes[code];
