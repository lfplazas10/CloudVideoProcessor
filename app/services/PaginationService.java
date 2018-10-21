package services;

import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PaginationService {

    private static JedisPool pool = new JedisPool(new JedisPoolConfig(), System.getenv("REDIS_HOST"));

    private class PaginationObject <T> implements Serializable {
        private List<T> results;
    }

    public static <T> PaginationObject<T> getPage(String searchId, int pageNum) throws Exception{
        List<String> fd = new ArrayList<>();
        fd.add("a");
        fd.add("c");
        fd.add("f");
        pool.getResource().set(searchId.getBytes(), serialize(fd));
        byte [] response = pool.getResource().get(searchId.getBytes());
        if (response == null){
            //Get all from dynamoDB
        }

        PaginationObject<T> page = deserialize(response);
        //Any validation
        return page;
    }

    private static byte[] serialize(Object list) throws Exception{
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(list);
        return bos.toByteArray();
    }

    private static <T> T deserialize(byte[] bytes) throws Exception{
        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
        ObjectInput in = new ObjectInputStream(bis);
        return (T) in.readObject();
    }
}
