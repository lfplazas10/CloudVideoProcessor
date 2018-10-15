package models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.sql.Timestamp;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@DynamoDBTable(tableName="Contests")
public class Contest {

    @DynamoDBHashKey(attributeName="id")
    private Long id;

    @DynamoDBAttribute(attributeName = "urlText")
    private String url;

    private String description, ownerEmail, bannerUrl, name;

//    @JsonFormat(shape=JsonFormat.Shape.NUMBER, pattern="s")
    private Long startDate, endDate, creationDate;

    public Contest(){

    }

//    public Contest(String url, String description, String ownerEmail, String bannerUrl, Timestamp startDate, Timestamp endDate) {
//        this.url = url;
//        this.description = description;
//        this.ownerEmail = ownerEmail;
//        this.bannerUrl = bannerUrl;
//        this.startDate = startDate;
//        this.endDate = endDate;
//    }
//
//    public Contest(String url, String description, String ownerEmail, String bannerUrl, String name, Timestamp startDate, Timestamp endDate, Timestamp creationDate) {
//        this.url = url;
//        this.description = description;
//        this.ownerEmail = ownerEmail;
//        this.bannerUrl = bannerUrl;
//        this.name = name;
//        this.startDate = startDate;
//        this.endDate = endDate;
//        this.creationDate = creationDate;
//    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public Long getStartDate() {
        return startDate;
    }

    public void setStartDate(Long startDate) {
        this.startDate = startDate;
    }

    public Long getEndDate() {
        return endDate;
    }

    public void setEndDate(Long endDate) {
        this.endDate = endDate;
    }

    public Long getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Long creationDate) {
        this.creationDate = creationDate;
    }
}
