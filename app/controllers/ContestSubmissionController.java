package controllers;

import controllers.base.BaseController;
import models.Contest;
import models.ContestSubmission;
import play.mvc.Result;
import play.mvc.With;
import java.time.OffsetDateTime;

public class ContestSubmissionController extends BaseController {

    @With(Session.class)
    public Result getAll() {
        try {
            Contest contest = bodyAs(Contest.class);
            return ok (ContestSubmission.find.query().where().eq("contest_id", contest.getId()).findList());
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result create() {
        try {
            ContestSubmission cs = bodyAs(ContestSubmission.class);
            cs.setCreationDate(OffsetDateTime.now());
            cs.save();
            return ok(cs);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result update() {
        try {
            String user = session("connected");
            ContestSubmission cs = bodyAs(ContestSubmission.class);
            cs.update();
            return ok(cs);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }
    
}
