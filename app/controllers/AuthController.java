package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import controllers.base.BaseController;
import models.Manager;
import models.base.User;
import play.filters.csrf.AddCSRFToken;
import play.filters.csrf.CSRF;
import play.mvc.Result;

public class AuthController extends BaseController {

    @AddCSRFToken
    public Result getToken() {
        return ok(CSRF.getToken(request()).map(CSRF.Token::value).orElse("no token"));
    }

    public Result getManager(){
        try{
            return ok( Manager.find.byId( session("connected") ) );
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    public Result createManager() {
        try {
            Manager user = bodyAs(Manager.class);
            boolean exists = Manager.find.query().where()
                    .eq("email", user.getEmail()).findOne() != null;

            if (exists)
                throw new Exception("There is already an user with that email");

            user.hashAndSavePassword();
            user.save();
            return ok(user);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    public Result test() {
        try {
            String user = session("connected");
            return ok(user);
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    public Result login() {
        try {
            JsonNode request = request().body().asJson();
            String email = request.get("email").asText();
            String password = request.get("password").asText();
            User user = Manager.find.query().where().eq("email", email).findOne();

            if (user == null)
                throw new Exception("The user does not exist");
            if (!user.isPasswordCorrect(user, password))
                throw new Exception("The password is incorrect");

            session("connected", email);
            return ok(user);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    public Result logout() {
        try {
            response().discardCookie("session");
            return ok("logged out");
        } catch (Exception e){
            return error(e.getMessage());
        }
    }
}
