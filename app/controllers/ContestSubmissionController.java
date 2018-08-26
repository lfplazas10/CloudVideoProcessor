package controllers;

import controllers.base.BaseController;
import models.Contest;
import models.ContestSubmission;
import org.apache.commons.io.FilenameUtils;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class ContestSubmissionController extends BaseController {

    public Result receiveVideo(long contestSubmissionId){
        try {

            ContestSubmission cs = ContestSubmission.find.byId(contestSubmissionId);
            if (cs == null)
                throw new Exception("The submission doesn't exist");
            if (cs.getState() != ContestSubmission.State.Waiting)
                throw new Exception("This submission already has a video");

            Http.MultipartFormData<File> body = request().body().asMultipartFormData();
            Http.MultipartFormData.FilePart<File> video = body.getFile("video");
            if (video == null)
                throw new Exception("The video was not received");

            String contentType = video.getContentType();
            File videoFile = video.getFile();
            String videoId = UUID.randomUUID().toString();
            //TODO: When improving performance, create and attach a proper Executor to this future
            CompletableFuture.runAsync(() -> {
                try {
                    Path path = Paths.get("videos",
                            String.valueOf(cs.getContestId()),
                            videoId+ "." +FilenameUtils.getExtension( video.getFilename() ));
                    byte [] stream = new byte [(int) videoFile.length()];
                    new FileInputStream(videoFile).read(stream);
                    Files.createDirectories( path.getParent() );
                    Files.createFile(path);
                    Files.write(path, stream);
                } catch (Exception e){
                    //Notify client about error
                    e.printStackTrace();
                }
            });
            cs.setVideoId(videoId);
            cs.setVideoType(contentType);
            cs.setState(ContestSubmission.State.Submitted);
            cs.update();
            return ok(cs);

        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    public Result create() {
        try {
            ContestSubmission cs = bodyAs(ContestSubmission.class);
            if (Contest.find.byId(cs.getContestId()) == null)
                throw new Exception("The contest doesn't exist, it's kinda hard to create a submission on a non existing contest");

            cs.setCreationDate(OffsetDateTime.now());
            cs.setState(ContestSubmission.State.Waiting);
            cs.save();
            return ok(cs);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

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