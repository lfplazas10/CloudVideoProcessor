package controllers;

import controllers.base.BaseController;
import models.Contest;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class ContestController extends BaseController {

    @With(ContestOwnerShip.class)
    public Result create() {
        try {
            Contest contest = bodyAs(Contest.class);

            if(! session("connected").equals(contest.getOwnerEmail() ) )
                throw new Exception("This shouldn't happen");
            if (Contest.find().query().where().eq("url", contest.getUrl()).findOne() != null)
                throw new Exception("There is already a contest with that URL, please try a different one");

            contest.save();
            return ok(contest);
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
