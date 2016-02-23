contract ZeroDollarHomePage {
    uint constant ShaLength = 40;

    enum ResponseCodes {
        Ok,
        InvalidSha,
        InvalidAuthorEmail,
        InvalidAuthorName,
        InvalidImageUrl,
        RequestNotFound
    }

    struct Request {
        uint id;
        string commitSha;
        string authorEmail;
        string authorName;
        string imageUrl;
        uint createdAt; // timestamp for pull request creation
        uint claimedAt; // timestamp for image submission
        uint displayedAt; // timestamp for image display
    }

    mapping (string => Request) _requests; // key is the commit sha
    uint public numberOfRequests;
    string[] _queue;
    uint public queueLength;
    uint _current;

    function ZeroDollarHomePage() {
        numberOfRequests = 0;
        queueLength = 0;
        _current = 0;
    }

    /*
     * Register a new pull request merged on github
     */
    function newPullRequest(string commitSha, string authorEmail, string authorName) returns (uint8) {
        if (bytes(commitSha).length != ShaLength) {
            return uint8(ResponseCodes.InvalidSha);
        }

        // TODO: better validation of emails
        if (bytes(authorEmail).length <= 0) {
            return uint8(ResponseCodes.InvalidAuthorEmail);
        }

        if (bytes(authorName).length <= 0) {
            return uint8(ResponseCodes.InvalidAuthorName);
        }

        numberOfRequests += 1;
        _requests[commitSha].id = numberOfRequests;
        _requests[commitSha].commitSha = commitSha;
        _requests[commitSha].authorEmail = authorEmail;
        _requests[commitSha].authorName = authorName;
        _requests[commitSha].createdAt = now;
        return uint8(ResponseCodes.Ok);
    }

    /*
     * Saves the image submitted by a pull request author
     */
    function claimWithImage(string commitSha, string imageUrl) returns (uint8) {
        if (bytes(commitSha).length != ShaLength) {
            return uint8(ResponseCodes.InvalidSha);
        }

        if (bytes(imageUrl).length <= 0) {
            return uint8(ResponseCodes.InvalidImageUrl);
        }

        if (bytes(_requests[commitSha].commitSha).length == 0) {
            return uint8(ResponseCodes.RequestNotFound);
        }

        _requests[commitSha].imageUrl = imageUrl;
        _requests[commitSha].claimedAt = now;

        _queue.push(commitSha);
        queueLength += 1;

        return uint8(ResponseCodes.Ok);
    }

    /*
     * Marke a pull request with its image has having been displayed.
     */
    function closeRequest(string commitSha) returns (uint8) {
        if (bytes(commitSha).length != ShaLength) {
            return uint8(ResponseCodes.InvalidSha);
        }

        if (bytes(_requests[commitSha].commitSha).length == 0) {
            return uint8(ResponseCodes.RequestNotFound);
        }

        _requests[commitSha].displayedAt = now;
        delete _queue[0];
        queueLength -= 1;
        _current = _current + 1;
        return uint8(ResponseCodes.Ok);
    }

    /*
     * Get the next image to be displayed on the ZeroDollarHomePage site
     */
    function getLastNonPublished() returns (uint id, string commitSha, string authorEmail, string authorName, string imageUrl, uint createdAt, uint claimedAt) {
        if (_queue.length == 0) {
            return;
        }

        var request = _requests[_queue[_current]];
        id = request.id;
        commitSha = request.commitSha;
        authorEmail = request.authorEmail;
        authorName = request.authorName;
        imageUrl = request.imageUrl;
        createdAt = request.createdAt;
        claimedAt = request.claimedAt;
    }
}
