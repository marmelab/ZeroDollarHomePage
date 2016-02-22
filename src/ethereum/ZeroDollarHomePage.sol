contract ZeroDollarHomePageRequest {
    uint constant ShaLength = 40;

    enum ResponseCodes {
        Ok,
        InvalidSha,
        InvalidAuthorEmail,
        InvalidAuthorName,
        InvalidImageUrl,
        RequestNotFound, // no matching pull request
    }

    struct Request {
        string commitSha;
        string authorEmail;
        string authorName;
        string imageUrl;
        uint createdAt; // timestamp for pull request creation
        uint claimedAt; // timestamp for image submission
        uint displayedAt; // timestamp for image display
    }

    mapping (string => Request) _requests; // key is the commit sha
    uint _numberOfRequests;
    string[] _queue;

    function ZeroDollarHomePageRequest() {
        _numberOfRequests = 0;
    }

    /*
     * Register a new pull request merged on github
     */
    function newPullRequest(string commitSha, string authorEmail, string authorName) returns (ResponseCodes result) {
        if (bytes(commitSha).length !== ShaLength) {
            return ResponseCodes.InvalidSha;
        }

        if (bytes(authorEmail).length <= 0) {
            return ResponseCodes.InvalidAuthorEmail;
        }

        if (bytes(authorName).length <= 0) {
            return ResponseCodes.InvalidAuthorName;
        }

        _requests[commitSha].commitSha = commitSha;
        _requests[commitSha].authorEmail = authorEmail;
        _requests[commitSha].authorName = authorName;
        _requests[commitSha].createdAt = now;
        return ResponseCodes.Ok;
    }

    /*
     * Saves the image submitted by a pull request author
     */
    function claimWithImage(string commitSha, string imageUrl) returns (ResponseCodes result) {
        if (bytes(commitSha).length !== ShaLength) {
            return ResponseCodes.InvalidSha;
        }

        if (bytes(imageUrl).length <= 0) {
            return ResponseCodes.InvalidImageUrl;
        }

        if (bytes(_requests[commitSha].commitSha).length == 0) {
            return ResponseCodes.RequestNotFound;
        }

        _requests[commitSha].imageUrl = imageUrl;
        _requests[commitSha].postedAt = now;

        _queue.push(commitSha);

        return ResponseCodes.Ok;
    }

    /*
     * Marke a pull request with its image has having been displayed.
     */
    function closeRequest(string commitSha) returns (ResponseCodes result) {
        if (bytes(commitSha).length !== ShaLength) {
            return ResponseCodes.InvalidSha;
        }

        if (bytes(_requests[commitSha].commitSha).length == 0) {
            return ResponseCodes.RequestNotFound;
        }

        _requests[_numberOfImageRequests].displayedAt = now;
        delete _queue[0];
        return ResponseCodes.Ok;
    }

    /*
     * Get the next image to be displayed on the ZeroDollarHomePage site
     */
    function getImageToDisplay() constant returns (ResponseCodes result, string authorName, string imageUrl) {
        if (_queue.length == 0) {
            return (ResponseCodes.RequestNotFound, "", "")
        }

        Request request = _requests[_queue[0]];
        return (ResponseCodes.Ok, request.authorName, request.imageUrl);
    }
}
