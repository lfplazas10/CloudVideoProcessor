package controllers;

import com.amazonaws.services.dynamodbv2.datamodeling.QueryResultPage;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import controllers.base.BaseController;
import models.Contest;
import models.ContestSubmission;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class ContestController extends BaseController {

    @With(Session.class)
    public Result getAll() {
        try {
            String user = session("connected");
            Map lep = (Map)bodyAs(Map.class).get("lastEvaluatedPage");
            QueryResultPage<Contest> qrp = queryList("ownerEmail", user, Contest.class, lep);
            return ok(qrp);
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    public Result getSingleContest(String url) {
        try {
            Contest contest = findOne("url", url, Contest.class);
            if (contest == null)
                throw new Exception("There is no contest with url "+url);

            contest.setOwnerEmail(null);
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    public Result receiveImage(String contestId){
        try {
            Contest contest = find(contestId, Contest.class);

            if (contest == null)
                throw new Exception("The contest doesn't exist");

            Http.MultipartFormData<File> body = request().body().asMultipartFormData();
            Http.MultipartFormData.FilePart<File> image = body.getFile("image");

            if (image == null)
                throw new Exception("The image was not received");

            File imageFile = image.getFile();
            String contentType = image.getContentType();
            String imageName = contest.getUrl() + "." + FilenameUtils.getExtension( image.getFilename() ) ;
            //TODO: When improving performance, create and attach a proper Executor to this future
            CompletableFuture.runAsync(() -> {
                try {
                    PutObjectRequest request = new PutObjectRequest("smarttools-images", imageName, imageFile)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

                    ObjectMetadata metadata = new ObjectMetadata();
                    metadata.setContentType(contentType);
                    request.setMetadata(metadata);
                    s3Client.putObject(request);
                }
                catch (Exception e){
                    e.printStackTrace();
                }
            });
            contest.setBannerUrl(imageName);
            save(contest);
            return ok(contest);
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result create() {
        try {
            Contest contest = bodyAs(Contest.class);

            if(! session("connected").equals(contest.getOwnerEmail() ) )
                throw new Exception("This shouldn't happen");

            if (findOne("url", contest.getUrl(), Contest.class) != null)
                throw new Exception("There is already a contest with that URL, please try a different one");

            contest.setCreationDate(System.currentTimeMillis());
            contest.setId( UUID.randomUUID().toString());
            save(contest);
            return ok(contest);
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result update() {
        try {
            String user = session("connected");
            Contest contest = bodyAs(Contest.class);
            Contest oldContest = find(contest.getId(), Contest.class);
            if (! oldContest.getOwnerEmail().equals(user))
                throw new Exception("The user does not own the contest");


            if (findOne("url", contest.getUrl(), Contest.class) != null
                && !contest.getUrl().equals( oldContest.getUrl() ))
                throw new Exception("There is already a contest with that URL, please try a different one");

            contest.setCreationDate(oldContest.getCreationDate());
            save(contest);
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result delete(String contestId) {
        try {
            String user = session("connected");
            Contest contest = find(contestId, Contest.class);
            if (! contest.getOwnerEmail().equals(user))
                throw new Exception("The user does not own the contest");

            delete(contest);

            //TODO: Update this
            //Delete all contest submissions
//            ContestSubmission.find.query()
//                    .where().eq("contest_id", contestId).delete();

            //Delete all videos
            Path path = Paths.get("videos", String.valueOf(contestId));

            if (Files.exists(path)) {
                Files.walk(path)
                        .filter(Files::isRegularFile)
                        .map(Path::toFile)
                        .forEach(File::delete);

                Files.delete(path);
            }

            return ok("deleted");
        } catch (Exception e){
            e.printStackTrace();
            return error(e.getMessage());
        }
    }

}
