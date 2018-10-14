package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import controllers.base.BaseController;
import models.Manager;
import play.Logger;
import play.filters.csrf.AddCSRFToken;
import play.mvc.Result;

public class AuthController extends BaseController {


    public Result getManager(){
        try{
            return ok( find(session("connected"), Manager.class) );
        } catch (Exception e){
            return error(e.getMessage());
        }
    }
    public Result createManager() {
        try {
            long inTime = System.currentTimeMillis();
            Manager user = bodyAs(Manager.class);
            boolean exists = find(user.getEmail(), Manager.class) != null;
            if (exists)
                throw new Exception("There is already an user with that email");

            user.hashAndSavePassword();
            save(user);
            Logger.debug("Created manager " +((System.currentTimeMillis()-inTime)/1000)+"s");
            return ok(user);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }
    public Result isActiveUser() {
        try {
            return ok(session("connected") != null);
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    @AddCSRFToken
    public Result login() {
        try {
            JsonNode request = request().body().asJson();
            String email = request.get("email").asText();
            String password = request.get("password").asText();
            Manager user = find(email, Manager.class);

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
