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
    }

    function test_closeRequest_should_returns_Ok() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newPullRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "toto@toto.com", "toto");
        app.claimWithImage("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "http://google.com/image.jpg");

        var result = app.closeRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d");
        assertUintsEqual(result, uint8(ZeroDollarHomePage.ResponseCodes.Ok), "Should have returned Ok");
    }

    function test_getLastNonPublished_should_returns_the_request() {
        ZeroDollarHomePage app = new ZeroDollarHomePage();
        app.newPullRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "toto@toto.com", "toto");
        app.claimWithImage("c603fa2eff16a0ecec85cf00aee0b6074be0c92d", "http://google.com/image.jpg");
        app.newPullRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92e", "toto2@toto2.com", "toto2");
        app.claimWithImage("c603fa2eff16a0ecec85cf00aee0b6074be0c92e", "http://google.com/image2.jpg");
        var (id,,) = app.getLastNonPublished();
        assertUintsEqual(id, 1, "Should have returned id 1");
        app.closeRequest("c603fa2eff16a0ecec85cf00aee0b6074be0c92d");
        (id,,) = app.getLastNonPublished();
        assertUintsEqual(id, 2, "Should have returned id 2");
    }

}
