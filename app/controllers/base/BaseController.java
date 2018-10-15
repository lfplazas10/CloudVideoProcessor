package controllers.base;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.*;
import com.amazonaws.services.dynamodbv2.model.*;
import play.libs.Json;
import play.mvc.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class BaseController extends Controller {

    protected static final String CONTENT_TYPE = "application/json";

    protected static final int PAGINATION = 2;

    protected static AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
            .withRegion(Regions.US_EAST_2)
            .build();

    protected void save(Object object) throws Exception{
        try {
            DynamoDBMapper mapper = new DynamoDBMapper(client);
            mapper.save(object);
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    protected void delete(Object obj){
        try {
            DynamoDBMapper mapper = new DynamoDBMapper(client);
            mapper.delete(obj);
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    protected <T> T find(Object id, Class<T> clazz){
        try {
            DynamoDBMapper mapper = new DynamoDBMapper(client);
            return clazz.cast(mapper.load(clazz, id));
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    protected <T> T findOne(String attribute, String value, Class<T> clazz){
        try {
            DynamoDBMapper mapper = new DynamoDBMapper(client);
            Map<String, AttributeValue> eav = new HashMap<>();
            eav.put(":val", new AttributeValue().withS(value));

            DynamoDBQueryExpression<T> queryExpression = new DynamoDBQueryExpression<T>()
                    .withKeyConditionExpression(attribute+" = :val")
                    .withExpressionAttributeValues(eav);


            if (attribute.equalsIgnoreCase("url")){
                queryExpression
                        .withKeyConditionExpression("urlText = :val")
                        .withConsistentRead(false)
                        .withIndexName("url-index");
            }

            List<T> answer = mapper.query(clazz, queryExpression);

            return answer.size() > 0 ? clazz.cast(answer.get(0)) : null;
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    protected <T> QueryResultPage<T> queryList(String attribute, String value,
                                               Class<T> clazz, Map<String,AttributeValue> lastEvaluatedPage){
        try {
            DynamoDBMapper mapper = new DynamoDBMapper(client);
            Map<String, AttributeValue> eav = new HashMap<>();
            eav.put(":val", new AttributeValue().withS(value));

            DynamoDBQueryExpression<T> queryExpression = new DynamoDBQueryExpression<T>()
                    .withKeyConditionExpression(attribute+" = :val")
                    .withExpressionAttributeValues(eav)
                    .withScanIndexForward(false)
                    .withExclusiveStartKey(lastEvaluatedPage)
                    .withLimit(PAGINATION);

            createQueryExpression(queryExpression, attribute);

            QueryResultPage<T> qrp = mapper.queryPage(clazz, queryExpression);
            return qrp;
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    private <T> void createQueryExpression(DynamoDBQueryExpression<T> queryExpression, String attribute){
        boolean globalIndex = false;
        if (attribute.equalsIgnoreCase("url")){
            queryExpression.withKeyConditionExpression("ownerEmail = :val");
            globalIndex = true;
        }
        else if (attribute.equalsIgnoreCase("ownerEmail")){
            queryExpression.withKeyConditionExpression("ownerEmail = :val");
            globalIndex = true;
        }
        if (globalIndex){
            queryExpression.withConsistentRead(false)
                    .withConsistentRead(false)
                    .withIndexName(attribute+"-index");
        }
    }

    protected <T> ScanResultPage<T> scanList(String attribute, String value, Class<T> clazz){
        try {

            DynamoDBMapper mapper = new DynamoDBMapper(client);
            Map<String, AttributeValue> eav = new HashMap<>();
            eav.put(":val", new AttributeValue().withS(value));

            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                    .withFilterExpression(attribute +"= :val")
                    .withExpressionAttributeValues(eav);

            return mapper.scanPage(clazz, scanExpression);
//            QueryResultPage<T> qrp = mapper.queryPage(clazz, queryExpression);
//            return qrp;
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    protected static <T> T bodyAs(Class<T> clazz) {
        Http.RequestBody body = request().body();
//        if (body == null || body.asJson() == null) {
//            System.out.println("ERROR, this should never happen");
//        }
        return Json.fromJson(body.asJson(), clazz);
    }

    protected Result ok(Object object) {
        return object == null ? ok() : Results.ok(Json.prettyPrint(Json.toJson(object))).as(CONTENT_TYPE);
    }

    public static Result ok(String message) {
        return ok( Json.parse("{\"status\":\""+message+"\"}") ).as(CONTENT_TYPE);
    }

    public static Result ok(String property, String text) {
        return ok( Json.parse("{\""+property+"\":\""+text+"\"}") ).as(CONTENT_TYPE);
    }

    protected Result error(String message) {
        return internalServerError(Json.parse("{\"error\":\""+message+"\"}"));
    }

    public static class Session extends Action.Simple {
        @Override
        public CompletionStage<Result> call(Http.Context ctx) {
            String user = ctx.current().session().get("connected");
            if (user == null)
                return CompletableFuture.completedFuture(
                        unauthorized()
                );
            return delegate.call(ctx);
        }
    }

}
