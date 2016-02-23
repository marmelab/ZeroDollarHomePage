import "./Asserter.sol";
import "./ZeroDollarHomePage.sol";
contract ZeroDollarHomePageTest is Asserter {

    function test_newPullRequest_should_returns_Ok() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        var result = app.newPullRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "toto@toto.com", "toto");
        assertUintsEqual(result, uint8(ZeroDollarHomePage.ResponseCodes.Ok), "Should have returned Ok");
    }

    function test_claimWithImage_should_returns_Ok() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newPullRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "toto@toto.com", "toto");
        var result = app.claimWithImage("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "http://google.com/image.jpg");
        assertUintsEqual(result, uint8(ZeroDollarHomePage.ResponseCodes.Ok), "Should have returned Ok");
        assertUintsEqual(app.queueLength(), 1, "Should have returned 1");
    }

    function test_closeRequest_should_returns_Ok() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newPullRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "toto@toto.com", "toto");
        app.claimWithImage("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "http://google.com/image.jpg");

        var result = app.closeRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d");
        assertUintsEqual(result, uint8(ZeroDollarHomePage.ResponseCodes.Ok), "Should have returned Ok");
        assertUintsEqual(app.queueLength(), 0, "Should have returned 0");
    }

}
