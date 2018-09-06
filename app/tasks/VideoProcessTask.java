package tasks;

import akka.actor.ActorSystem;
import models.ContestSubmission;
import scala.concurrent.ExecutionContext;
import scala.concurrent.duration.Duration;
import services.EmailService;
import javax.inject.Inject;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
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
                String videoPath = "videos/" + v.getContestId() + "/" + v.getVideoId();
                if (! v.getVideoId().endsWith(".mp4")) {
                    String command = "ffmpeg -i " + videoPath + " -preset fast -c:a aac -b:a 128k " +
                            "-codec:v libx264 -b:v 1000k -minrate 500k -maxrate 2000k -bufsize 2000k" +
                            " " + videoPath + ".mp4 -hide_banner";
                    Process p = Runtime.getRuntime().exec(command);
                    p.waitFor();         //This makes each execution synchronous
                }
                
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