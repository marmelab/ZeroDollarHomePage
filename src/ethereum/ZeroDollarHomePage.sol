contract ZeroDollarHomePage {
    uint constant ShaLength = 40;

    enum ResponseCodes {
        Ok,
        RequestNotFound,
        EmptyQueue
    }

    struct Request {
        uint id;
        string authorName;
        uint createdAt; // timestamp for pull request creation
        uint displayDate; // timestamp for image display
        uint displayedAt; // timestamp for when image has been displayed
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
    function newRequest(uint pullRequestId, string authorName) returns (uint code, uint displayDate) {
        if (pullRequestId <= 0) {
            throw;
        }

        /*if (_requests[pullRequestId].id == pullRequestId) {
            throw;
        }*/

        if (bytes(authorName).length <= 0) {
            throw;
        }

        numberOfRequests += 1;
        _requests[pullRequestId].id = pullRequestId;
        _requests[pullRequestId].authorName = authorName;
        _requests[pullRequestId].createdAt = now;

        _queue.push(pullRequestId);
        queueLength += 1;
        _requests[pullRequestId].displayDate = now + (queueLength * 1 days);

        code = uint8(ResponseCodes.Ok);
        displayDate = now + (queueLength * 1 days);
    }

    function getRequest(uint pullRequestId) returns (uint code, uint displayDate) {
        var request = _requests[pullRequestId];

        if (request.id != pullRequestId) {
            code = uint8(ResponseCodes.RequestNotFound);
            return;
        }

        code = uint8(ResponseCodes.Ok);
        displayDate = request.displayDate;
    }

    /*
     * Marke a pull request with its image has having been displayed.
     */
    function closeRequest() returns (uint8) {
        if (queueLength == 0) {
            return uint8(ResponseCodes.EmptyQueue);
        }

        _requests[_queue[_current]].displayedAt = now;
        delete _queue[0];
        queueLength -= 1;
        _current = _current + 1;
        return uint8(ResponseCodes.Ok);
    }

    /*
     * Get the next image to be displayed on the ZeroDollarHomePage site
     */
    function getLastNonPublished() returns (uint8 code, uint id, string authorName, uint createdAt) {
        if (queueLength == 0) {
            code = uint8(ResponseCodes.EmptyQueue);
            return;
        }

        var request = _requests[_queue[_current]];
        id = request.id;
        authorName = request.authorName;
        createdAt = request.createdAt;
        code = uint8(ResponseCodes.Ok);
    }
}
