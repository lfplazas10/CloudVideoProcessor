package controllers.base;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

public class BaseController extends Controller {

    protected static final String CONTENT_TYPE = "application/json";

    protected static <T> T bodyAs(Class<T> clazz) {
        Http.RequestBody body = request().body();
        if (body == null || body.asJson() == null) {
            System.out.println("ERROR, this should never happen");
        }
        return Json.fromJson(body.asJson(), clazz);
    }

    protected static Result ok(Object object) {
        return object == null ? ok() : ok(Json.prettyPrint(Json.toJson(object))).as(CONTENT_TYPE);
    }

    protected static Result error(String message) {
        return internalServerError(Json.parse("{\"error\":\""+message+"\"}"));
    }

}
