package controllers;

import controllers.base.BaseController;
import models.Contest;
import models.ContestSubmission;
import play.mvc.Result;
import play.mvc.With;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;

public class ContestController extends BaseController {

    @With(Session.class)
    public Result getAll() {
        try {
            String user = session("connected");
            return ok(Contest.find.query().where().eq("owner_email", user).orderBy("creation_date desc").findList());
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    public Result getSingleContest(String url) {
        try {
            Contest contest = Contest.find.query().where().eq("url", url).findOne();
            if (contest == null)
                throw new Exception("There is no contest with url "+url);

            contest.setOwnerEmail(null);
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result create() {
        try {
            Contest contest = bodyAs(Contest.class);

            if(! session("connected").equals(contest.getOwnerEmail() ) )
                throw new Exception("This shouldn't happen");
            if (Contest.find.query().where().eq("url", contest.getUrl()).findOne() != null)
                throw new Exception("There is already a contest with that URL, please try a different one");

            contest.setCreationDate(Timestamp.from(Instant.now()));
            contest.save();
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result update() {
        try {
            String user = session("connected");
            Contest contest = bodyAs(Contest.class);
            if (!Contest.find.byId(contest.getId()).getOwnerEmail().equals(user))
                throw new Exception("The user does not own the contest");

            contest.update();
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result delete(Long contestId) {
        try {
            String user = session("connected");
            if (!Contest.find.byId(contestId).getOwnerEmail().equals(user))
                throw new Exception("The user does not own the contest");

            Contest.find.deleteById(contestId);

            //Delete all contest submissions
            ContestSubmission.find.query()
                    .where().eq("contest_id", contestId).delete();

            //Delete all videos
            Path path = Paths.get("videos",
                    String.valueOf(contestId));

            Files.walk(path)
                    .filter(Files::isRegularFile)
                    .map(Path::toFile)
                    .forEach(File::delete);

            Files.delete(path);

            return ok("deleted");
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

}
