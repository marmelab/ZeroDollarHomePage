import "./Asserter.sol";
import "./ZeroDollarHomePage.sol";
contract ZeroDollarHomePageTest is Asserter {

    function test_newRequest_should_returns_Ok() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        var (code,) = app.newRequest(42, "toto", "http://google.com/image.jpg");

        assertUintsEqual(code, uint8(ZeroDollarHomePage.ResponseCodes.Ok), "Should have returned Ok");
    }

    function test_newRequest_should_returns_correct_date() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        var (code, publicationDate) = app.newRequest(42, "toto", "http://google.com/image.jpg");

        assertUintGT(publicationDate, now, "Date should have been greater than now");
    }

    function test_newRequest_should_returns_correct_date_when_queue_grows() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42, "toto", "http://google.com/image.jpg");
        var (code, publicationDate) = app.newRequest(43, "toto", "http://google.com/image.jpg");

        assertUintGT(publicationDate, now + 1 days, "Date should have been greater than now + 1 day");
    }

    function test_closeRequest_should_returns_Ok() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42, "toto", "http://google.com/image.jpg");

        var result = app.closeRequest(42);
        assertUintsEqual(result, uint8(ZeroDollarHomePage.ResponseCodes.Ok), "Should have returned Ok");
    }

    function test_getLastNonPublished_should_returns_the_request() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newRequest(42, "toto", "http://google.com/image.jpg");
        app.newRequest(43, "toto2", "http://google.com/image2.jpg");
        var (code, id,,) = app.getLastNonPublished();
        assertUintsEqual(id, 42, "Should have returned id 42");
        app.closeRequest(42);
        (code, id,,) = app.getLastNonPublished();
        assertUintsEqual(id, 43, "Should have returned id 43");
    }

}
