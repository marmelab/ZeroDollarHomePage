contract ZeroDollarHomePage {
    enum ResponseCodes {
        Ok,
        RequestNotFound,
        EmptyQueue
    }

    struct Request {
        uint id;
        uint position; // position at creation time
    }

    // key is the pull request id
    // value the estimated time before display when the pr was claimed
    mapping (uint => Request) _requests;
    uint[] _allRequests;
    uint[] _queue;
    uint _current;
    address owner;

    function ZeroDollarHomePage() {
        owner = msg.sender;
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
    function newRequest(uint pullRequestId) {
        if (pullRequestId <= 0) {
            throw;
        }

        // Check that the pr hasn't already be claimed
        if (_requests[pullRequestId].id == pullRequestId) {
            throw;
        }

        _requests[pullRequestId].id = pullRequestId;
        _requests[pullRequestId].position = _queue.length;

        _queue.push(pullRequestId);
        _allRequests.push(pullRequestId);
    }

    /*
     * Move to the next request in _queue.
     */
    function closeRequest() returns (uint8) {
        if (_queue.length == 0) {
            return uint8(ResponseCodes.EmptyQueue);
        }

        delete _queue[0];
        _current = _current + 1;

        for (uint i = 0; i < _allRequests.length - 1; i++) {
            _requests[_allRequests[i]].position--;
        }

        return uint8(ResponseCodes.Ok);
    }

    function getRequestPosition(uint pullRequestId) constant returns (uint) {
        return _requests[pullRequestId].position;
    }

    function getQueueLength() constant returns (uint) {
        return _queue.length;
    }

    /*
     * Get the next pull-request to be displayed on the ZeroDollarHomePage site
     */
    function getLastNonPublished() constant returns (uint) {
        if (_queue.length == 0) {
            return uint(ResponseCodes.EmptyQueue);
        }

        return _queue[_current];
    }
}
