import "./Test.sol";
import "./ZeroDollarHomePage.sol";

contract ZeroDollarHomePageTest is Test {
    function testNewRequest_should_insert_a_new_request() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);
        app.getQueueLength().assertEqual(1, "Should have returned 1");
    }

    function test_getRequestPosition_should_returns_correct_position() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);
        app.getRequestPosition(42).assertEqual(0, "Should have returned 0");
    }

    /*function test_newRequest_should_returns_correct_date_when_queue_grows() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);
        var (code, publicationDate) = app.newRequest(43);

        assertUintGT(publicationDate, now + 1 days, "Date should have been greater than now + 1 day");
    }*/

    function test_closeRequest_should_returns_Ok_and_remove_request_from_queue() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);

        app.closeRequest().assertEqual(0, "Should have returned 0");
        app.getLastNonPublished().assertEqual(0, "Should have returned 0");
    }

    function test_getLastNonPublished_should_returns_the_request_id() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42);
        app.newRequest(43);
        app.getLastNonPublished().assertEqual(42, "Should have returned id 42");
        app.closeRequest();
        app.getLastNonPublished().assertEqual(43, "Should have returned id 43");
    }
}
