contract ZeroDollarHomePage {
    uint constant ShaLength = 40;

    enum ResponseCodes {
        Ok,
        InvalidPullRequestId,
        InvalidAuthorName,
        InvalidImageUrl,
        RequestNotFound,
        EmptyQueue
    }

    struct Request {
        uint id;
        string authorName;
        string imageUrl;
        uint createdAt; // timestamp for pull request creation
        uint displayedAt; // timestamp for image display
    }

    mapping (uint => Request) _requests; // key is the pull request id
    uint public numberOfRequests;
    uint[] _queue;
    uint public queueLength;
    uint _current;
    address owner;

    function ZeroDollarHomePage() {
        owner = msg.sender;

        numberOfRequests = 0;
        queueLength = 0;
        _current = 0;
    }

    function remove() {
        if (msg.sender == owner){
            suicide(owner);
        }
    }

    /*
     * Register a new pull request merged on github
     */
    function newRequest(uint pullRequestId, string authorName, string imageUrl) returns (uint8 code, uint displayDate) {
        if (pullRequestId <= 0) {
            code = uint8(ResponseCodes.InvalidPullRequestId);
            return;
        }

        if (bytes(authorName).length <= 0) {
            code = uint8(ResponseCodes.InvalidAuthorName);
            return;
        }

        if (bytes(imageUrl).length <= 0) {
            code = uint8(ResponseCodes.InvalidImageUrl);
            return;
        }

        numberOfRequests += 1;
        _requests[pullRequestId].id = pullRequestId;
        _requests[pullRequestId].authorName = authorName;
        _requests[pullRequestId].imageUrl = imageUrl;
        _requests[pullRequestId].createdAt = now;

        _queue.push(pullRequestId);
        queueLength += 1;

        code = uint8(ResponseCodes.Ok);
        displayDate = now + (queueLength * 1 days);
    }

    /*
     * Marke a pull request with its image has having been displayed.
     */
    function closeRequest(uint pullRequestId) returns (uint8) {
        if (pullRequestId <= 0) {
            return uint8(ResponseCodes.InvalidPullRequestId);
        }

        if (_requests[pullRequestId].id <= 0) {
            return uint8(ResponseCodes.RequestNotFound);
        }

        _requests[pullRequestId].displayedAt = now;
        delete _queue[0];
        queueLength -= 1;
        _current = _current + 1;
        return uint8(ResponseCodes.Ok);
    }

    /*
     * Get the next image to be displayed on the ZeroDollarHomePage site
     */
    function getLastNonPublished() returns (uint8 code, uint id, string authorName, string imageUrl, uint createdAt) {
        if (_queue.length == 0) {
            code = uint8(ResponseCodes.EmptyQueue);
        }

        var request = _requests[_queue[_current]];
        id = request.id;
        authorName = request.authorName;
        imageUrl = request.imageUrl;
        createdAt = request.createdAt;
        code = uint8(ResponseCodes.Ok);
    }
}
