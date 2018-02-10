import "./Test.sol";
import "./ZeroDollarHomePage.sol";

contract ZeroDollarHomePageTest is Test {
    function testNewRequest_should_insert_a_new_request() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);
        app.closeRequest();
        app.getLastNonPublished().assertEqual(42, "Should have returned 42");
    }

    function testNewRequest_should_not_insert_duplicate_request() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);
        app.newRequest(43);
        app.newRequest(42);
        app.closeRequest();
        app.closeRequest();
        app.closeRequest();
        app.getLastNonPublished().assertEqual(43, "Should have returned 43"); // Should be an empty queue
    }

    function test_closeRequest_should_close_current_request_and_move_queue_forward() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);
        app.newRequest(43);
        app.closeRequest();
        app.closeRequest();
        app.getLastNonPublished().assertEqual(43, "Should have returned 43");
    }
}
