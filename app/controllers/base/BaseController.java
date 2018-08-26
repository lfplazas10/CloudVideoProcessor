package controllers.base;

import play.libs.Json;
import play.mvc.*;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class BaseController extends Controller {

    protected static final String CONTENT_TYPE = "application/json";

    protected static <T> T bodyAs(Class<T> clazz) {
        Http.RequestBody body = request().body();
        if (body == null || body.asJson() == null) {
            System.out.println("ERROR, this should never happen");
        }
        return Json.fromJson(body.asJson(), clazz);
    }

    protected Result ok(Object object) {
        return object == null ? ok() : Results.ok(Json.prettyPrint(Json.toJson(object))).as(CONTENT_TYPE);
    }

    public static Result ok(String message) {
        return ok( Json.parse("{\"status\":\""+message+"\"}") ).as(CONTENT_TYPE);
    }

    public static Result ok(String property, String text) {
        return ok( Json.parse("{\""+property+"\":\""+text+"\"}") ).as(CONTENT_TYPE);
    }

    protected Result error(String message) {
        return internalServerError(Json.parse("{\"error\":\""+message+"\"}"));
    }

    public static class Session extends Action.Simple {
        @Override
        public CompletionStage<Result> call(Http.Context ctx) {
            String user = ctx.current().session().get("connected");
            if (user == null)
                return CompletableFuture.completedFuture(
                        unauthorized()
                );
            return delegate.call(ctx);
        }
    }

}
