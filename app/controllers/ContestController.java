package controllers;

import controllers.base.BaseController;
import models.Contest;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;

import java.time.OffsetDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class ContestController extends BaseController {

    @With(ContestOwnerShip.class)
    public Result getAll() {
        try {
            String user = session("connected");
            return ok(Contest.find().query().where().eq("owner_email", user).orderBy("creation_date desc").findList());
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    @With(ContestOwnerShip.class)
    public Result create() {
        try {
            Contest contest = bodyAs(Contest.class);

            if(! session("connected").equals(contest.getOwnerEmail() ) )
                throw new Exception("This shouldn't happen");
            if (Contest.find().query().where().eq("url", contest.getUrl()).findOne() != null)
                throw new Exception("There is already a contest with that URL, please try a different one");

            contest.setCreationDate(OffsetDateTime.now());
            contest.save();
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(ContestOwnerShip.class)
    public Result update() {
        try {
            String user = session("connected");
            Contest contest = bodyAs(Contest.class);
            if (!Contest.find().byId(contest.getId()).getOwnerEmail().equals(user))
                throw new Exception("The user does not own the contest");

            contest.update();
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(ContestOwnerShip.class)
    public Result delete(Long contestId) {
        try {
            String user = session("connected");
            if (!Contest.find().byId(contestId).getOwnerEmail().equals(user))
                throw new Exception("The user does not own the event");

            Contest.find().deleteById(contestId);
            return ok("deleted");
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    static class ContestOwnerShip extends Action.Simple {

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
