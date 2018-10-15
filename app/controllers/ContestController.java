package controllers;

import com.amazonaws.services.dynamodbv2.datamodeling.QueryResultPage;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import controllers.base.BaseController;
import models.Contest;
//import models.ContestSubmission;
import org.apache.commons.io.FilenameUtils;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.*;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class ContestController extends BaseController {

    @With(Session.class)
    public Result getAll() {
        try {
            String user = session("connected");
            QueryResultPage<Contest> qrp = queryList("ownerEmail", user, Contest.class, bodyAs(Map.class));
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

    public Result getImage(Long id){
        try {
            Contest contest = find(id, Contest.class);
            if (contest == null)
                throw new Exception("That contest doesn't exist");

            Path path = Paths.get("nfs",
                    "images",
                    contest.getBannerUrl());
            byte [] image = Files.readAllBytes(path);
            if (image.length <= 0)
                throw new Exception("Error reading the image");

            return ok(image);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    public Result receiveImage(long contestId){
        try {
            Contest contest = find(contestId, Contest.class);

            if (contest == null)
                throw new Exception("The contest doesn't exist");

/*          Commented out this to be able to update a contest banner image
            if (contest.getBannerUrl() != null)
                throw new Exception("This contest already has an image");*/

            Http.MultipartFormData<File> body = request().body().asMultipartFormData();
            Http.MultipartFormData.FilePart<File> image = body.getFile("image");

            if (image == null)
                throw new Exception("The image was not received");

            File imageFile = image.getFile();
            String imageName = contest.getUrl() + "." + FilenameUtils.getExtension( image.getFilename() ) ;
            //TODO: When improving performance, create and attach a proper Executor to this future
            CompletableFuture.runAsync(() -> {

                try {
                    Path path = Paths.get("nfs",
                            "images",
                            imageName);
                    byte [] stream = new byte [(int) imageFile.length()];
                    new FileInputStream(imageFile).read(stream);
                    Files.createDirectories( path.getParent() );
                    try {
                        Files.createFile(path);
                    } catch (FileAlreadyExistsException fae){
                        //This is perfectly normal, might happen if
                        //1. The user is updating the contest image
                        //2. The user has the same image for 2 different contests.
                    }
                    Files.write(path, stream, StandardOpenOption.TRUNCATE_EXISTING);
                }
                catch (Exception e){
                    //Notify client about error
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
            contest.setId( Math.abs(UUID.randomUUID().getMostSignificantBits() ) );
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
//            contest.update();
            return ok(contest);
        } catch (Exception e){
            return error(e.getMessage());
        }
    }

    @With(Session.class)
    public Result delete(Long contestId) {
        try {
            String user = session("connected");
            Contest contest = find(contestId, Contest.class);
            if (! contest.getOwnerEmail().equals(user))
                throw new Exception("The user does not own the contest");

            delete(contest);

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
