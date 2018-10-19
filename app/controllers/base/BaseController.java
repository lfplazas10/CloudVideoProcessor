package controllers.base;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.*;
import com.amazonaws.services.dynamodbv2.model.*;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import play.libs.Json;
import play.mvc.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.SendMessageRequest;

public class BaseController extends Controller {

    protected static final String CONTENT_TYPE = "application/json";
    protected static final int PAGINATION = 30;
    protected static final String QUEUE_URL = "https://sqs.us-east-2.amazonaws.com/306743161273/videos.fifo";
    private static AWSCredentialsProvider awsCreds = new AWSStaticCredentialsProvider( new BasicAWSCredentials(System.getenv("AWS_ACCESS_KEY"), System.getenv("AWS_ACCESS_SECRET")) );
    private static Regions awsRegion = Regions.US_EAST_2;


    protected static AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
            .withRegion(awsRegion)
            .withCredentials(awsCreds)
            .build();

    protected static AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
            .withRegion(awsRegion)
            .withCredentials(awsCreds)
            .build();

    protected static AmazonSQS sqs = AmazonSQSClientBuilder.standard()
            .withRegion(awsRegion)
            .withCredentials(awsCreds)
            .build();

//        static{
//        try {
//            Config config = new Config();
//            config.useReplicatedServers()
//                    .setScanInterval(2000) // master node change scan interval
//                    // use "rediss://" for SSL connection
//                    .addNodeAddress("redis://cache-001.qbtphv.0001.use2.cache.amazonaws.com:6379");
////                    .addNodeAddress("cache-003.qbtphv.0001.use2.cache.amazonaws.com");
//
//            RedissonClient redisson = Redisson.create(config);
//        } catch (Exception e){
//            e.printStackTrace();
//        }
//    }

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
            queryExpression.withKeyConditionExpression("urlText = :val");
            globalIndex = true;
        } else if (attribute.equalsIgnoreCase("ownerEmail")){
            queryExpression.withKeyConditionExpression("ownerEmail = :val");
            globalIndex = true;
        } else if (attribute.equalsIgnoreCase("contestId")){
            queryExpression.withKeyConditionExpression("contestId = :val");
            globalIndex = true;
        }
        if (globalIndex){
            queryExpression
                    .withConsistentRead(false)
                    .withIndexName(attribute+"-index");
        }
    }

    protected <T> QueryResultPage<T> scanList2(Class<T> clazz, Map<String,AttributeValue> lastEvaluatedPage,
                                               String... keyValuePairs){
        try {
            DynamoDBMapper mapper = new DynamoDBMapper(client);
            Map<String, AttributeValue> eav = new HashMap<>();


            eav.put(":val0", new AttributeValue().withS(keyValuePairs[1]));
            eav.put(":val2", new AttributeValue().withS(keyValuePairs[3]));

            DynamoDBQueryExpression<T> queryExpression = new DynamoDBQueryExpression<T>()
                    .withKeyConditionExpression("contestId"+" = :val0")
                    .withFilterExpression("stateText"+" = :val2")
                    .withExpressionAttributeValues(eav)
                    .withIndexName("contestId"+"-index")
                    .withScanIndexForward(false)
                    .withConsistentRead(false)
                    .withExclusiveStartKey(lastEvaluatedPage)
                    .withLimit(PAGINATION);

            QueryResultPage<T> qrp = mapper.queryPage(clazz, queryExpression);
            return qrp;
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    protected <T> ScanResultPage<T> scanList(Class<T> clazz, Map<String,AttributeValue> lastEvaluatedPage,
                                             String... keyValuePairs){
        try {
            DynamoDBMapper mapper = new DynamoDBMapper(client);
            Map<String, AttributeValue> eav = new HashMap<>();
            for (int i = 1; i < keyValuePairs.length; i+=2) {
                eav.put(":val"+(i-1), new AttributeValue().withS(keyValuePairs[i]));
            }

            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                    .withLimit(PAGINATION)
                    .withExpressionAttributeValues(eav);

            String expression = "";
            for (int i = 0; i < keyValuePairs.length; i+=2) {
                expression += keyValuePairs[i] + " = :val" + i ;
                if (i+2 < keyValuePairs.length)
                    expression += " and ";
            }
            scanExpression.withFilterExpression(expression);

            return mapper.scanPage(clazz, scanExpression);
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    protected static <T> T bodyAs(Class<T> clazz) {
        Http.RequestBody body = request().body();
        if (body == null || body.asJson() == null) {
            System.out.println("ERROR, this should never happen");
        }
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
