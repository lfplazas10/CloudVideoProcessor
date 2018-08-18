package controllers.base;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Results;

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

}
