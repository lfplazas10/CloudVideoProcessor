//package models;
//
//import io.ebean.Finder;
//import models.base.BaseModel;
//import javax.persistence.Entity;
//import javax.persistence.Table;
//import java.sql.Timestamp;
//import java.time.OffsetDateTime;
//
//@Entity
//@Table(name = "ContestSubmissions")
//public class ContestSubmission extends BaseModel {
//
//    public static final Finder<Long, ContestSubmission> find = new Finder<>(ContestSubmission.class);
//
//    public enum State {
//        Waiting,
//        Processing,
//        Processed
//    }
//
//    private String firstName, lastName, email, description, videoId, videoType, contestUrl;
//
//    private State state;
//
//    private long contestId;
//
//    private Timestamp creationDate;
//
//    public String getContestUrl() {
//        return contestUrl;
//    }
//
//    public void setContestUrl(String contestUrl) {
//        this.contestUrl = contestUrl;
//    }
//
//    public String getVideoType() {
//        return videoType;
//    }
//
//    public void setVideoType(String videoType) {
//        this.videoType = videoType;
//    }
//
//    public String getVideoId() {
//        return videoId;
//    }
//
//    public void setVideoId(String videoId) {
//        this.videoId = videoId;
//    }
//
//    public long getContestId() {
//        return contestId;
//    }
//
//    public void setContestId(long contestId) {
//        this.contestId = contestId;
//    }
//
//    public Timestamp getCreationDate() {
//        return creationDate;
//    }
//
//    public void setCreationDate(Timestamp creationDate) {
//        this.creationDate = creationDate;
//    }
//
//    public String getFirstName() {
//        return firstName;
//    }
//
//    public void setFirstName(String firstName) {
//        this.firstName = firstName;
//    }
//
//    public String getLastName() {
//        return lastName;
//    }
//
//    public void setLastName(String lastName) {
//        this.lastName = lastName;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public State getState() {
//        return state;
//    }
//
//    public void setState(State state) {
//        this.state = state;
//    }
//
//}
