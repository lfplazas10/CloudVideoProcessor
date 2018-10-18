package controllers;

import com.amazonaws.services.dynamodbv2.datamodeling.QueryResultPage;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import controllers.base.BaseController;
import models.Contest;
import models.ContestSubmission;
import org.apache.commons.io.FilenameUtils;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class ContestSubmissionController extends BaseController {

    public Result receiveVideo(String contestSubmissionId){
        try {
            ContestSubmission cs = find(contestSubmissionId, ContestSubmission.class);
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
            String videoId = UUID.randomUUID().toString()+ "." +FilenameUtils.getExtension( video.getFilename() ) ;
            //TODO: When improving performance, create and attach a proper Executor to this future
            CompletableFuture.runAsync(() -> {
                try {
                    PutObjectRequest request = new PutObjectRequest("modeld-videos/raw", videoId, videoFile)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

                    ObjectMetadata metadata = new ObjectMetadata();
                    metadata.setContentType(contentType);
//                    metadata.addUserMetadata("x-amz-meta-title", "someTitle");
                    request.setMetadata(metadata);
                    s3Client.putObject(request);
                } catch (Exception e){
                    e.printStackTrace();
                }
            });
            cs.setVideoId(videoId);
            cs.setVideoType(contentType);
            cs.setState(ContestSubmission.State.Processing);
            save(cs);
            return ok(cs);
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    public Result getRawVideo(String contestId, String videoId){
        try {
            Path path = Paths.get("nfs",
                    "videos",
                    "raw",
                    String.valueOf(contestId),
                    videoId);
            byte [] video = Files.readAllBytes(path);
            if (video.length <= 0)
                throw new Exception("Error reading the video");

            return ok(video);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    public Result getConvertedVideo(String contestId, String videoId){
        try {
            Path path = Paths.get("nfs",
                    "videos",
                    "converted",
                    String.valueOf(contestId),
                    videoId);
            byte [] video = Files.readAllBytes(path);
            if (video.length <= 0)
                throw new Exception("Error reading the video");

            return ok(video);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    public Result create() {
        try {
            ContestSubmission cs = bodyAs(ContestSubmission.class);

            if (find(cs.getContestId(), Contest.class) == null)
                throw new Exception("The contest doesn't exist, it's kinda hard to create a submission for a non existing contest");

            cs.setCreationDate( System.currentTimeMillis() );
            cs.setState(ContestSubmission.State.Waiting);
            cs.setId( UUID.randomUUID().toString());
            save(cs);
            return ok(cs);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result getContestSubmissions(String contestId) {
        try {
            if (find(contestId, Contest.class) == null)
                throw new Exception("The contest doesn't exist");

            Map lep = (Map)bodyAs(Map.class).get("lastEvaluatedPage");
            QueryResultPage<ContestSubmission> qrp = queryList("contestId", contestId, ContestSubmission.class, lep);
            return ok (qrp);
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    public Result getProcessedVideos(String contestId) {
        try {
            if (find(contestId, Contest.class) == null)
                throw new Exception("The contest doesn't exist");

            Map lep = (Map)bodyAs(Map.class).get("lastEvaluatedPage");
//            QueryResultPage<ContestSubmission> qrp = queryList("contestId", contestId, ContestSubmission.class, lep);

            QueryResultPage<ContestSubmission> srp = scanList2(ContestSubmission.class, lep,
                    "contestId", contestId, "stateText", "Processed");
//            qrp.getResults().stream().filter(result -> result.getState().equals(ContestSubmission.State.Processed));
            return ok (srp);
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
            save(cs);
            return ok(cs);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

}
