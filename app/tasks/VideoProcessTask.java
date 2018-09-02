package tasks;

import akka.actor.ActorSystem;
import models.ContestSubmission;
import scala.concurrent.ExecutionContext;
import scala.concurrent.duration.Duration;
import services.EmailService;
import javax.inject.Inject;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class VideoProcessTask {

    private final ActorSystem actorSystem;
    private final ExecutionContext executionContext;

    @Inject
    public VideoProcessTask(ActorSystem actorSystem, ExecutionContext executionContext) {
        this.actorSystem = actorSystem;
        this.executionContext = executionContext;
        this.initialize();
    }

    private void initialize() {
        this.actorSystem.scheduler().schedule(
                Duration.create(20, TimeUnit.SECONDS), // initialDelay
                Duration.create(1, TimeUnit.MINUTES), // interval
                () -> run(),
                this.executionContext
        );
    }

    private void run(){
        List<ContestSubmission> videos =  ContestSubmission.find.query().where()
                .eq("state", ContestSubmission.State.Processing)
                .orderBy("creationDate asc").findList();
        videos.stream().forEach((v) -> {
            try {
                String videoPath = "videos/"+v.getContestId()+"/"+v.getVideoId();
                String command = "ffmpeg -i "+videoPath+" "+videoPath+".mp4 -hide_banner";
                Process p = Runtime.getRuntime().exec(command);
                p.waitFor();         //This makes each execution synchronous
                v.setState(ContestSubmission.State.Processed);
                v.save();
                CompletableFuture.runAsync(() -> {
                    //TODO: Uncomment for production
//                    EmailService.sendFromGMail("Processed",
//                            "Your video was successfully processed, you can now watch it in our website",
//                            v.getEmail());
                });
                System.out.println("Processed "+v.getVideoId());
            } catch (IOException | InterruptedException e){
                e.printStackTrace();
            }
        });
    }

}