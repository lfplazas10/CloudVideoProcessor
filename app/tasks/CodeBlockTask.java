package tasks;

import akka.actor.ActorSystem;
import models.ContestSubmission;
import scala.concurrent.ExecutionContext;
import scala.concurrent.duration.Duration;
import javax.inject.Inject;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class CodeBlockTask {

    private final ActorSystem actorSystem;
    private final ExecutionContext executionContext;

    @Inject
    public CodeBlockTask(ActorSystem actorSystem, ExecutionContext executionContext) {
        this.actorSystem = actorSystem;
        this.executionContext = executionContext;
        this.initialize();
    }

    private void initialize() {
        this.actorSystem.scheduler().schedule(
                Duration.create(10, TimeUnit.SECONDS), // initialDelay
                Duration.create(1, TimeUnit.MINUTES), // interval
                () -> run(),
                this.executionContext
        );
    }

    private void run(){
        System.out.println("HERE I AM");
        List<ContestSubmission> videos =  ContestSubmission.find.query().where()
                .eq("state", ContestSubmission.State.Processing)
                .orderBy("creationDate asc").findList();
        videos.stream().forEach((v) -> {
            try {
                String videoPath = "videos/"+v.getContestId()+"/"+v.getVideoId();
                String command = "ffmpeg -i "+videoPath+" "+videoPath+".mp4 -hide_banner";
                Process p = Runtime.getRuntime().exec(command);
                p.waitFor();
                v.setState(ContestSubmission.State.Processed);
                v.save();
                System.out.println("Processed "+v.getVideoId());
            } catch (IOException | InterruptedException e){
                e.printStackTrace();
            }
        });
    }
}