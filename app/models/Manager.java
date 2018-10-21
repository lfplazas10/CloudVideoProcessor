package models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIgnore;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.hash.Hashing;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

@DynamoDBTable(tableName="Managers")
public class Manager {

    private String firstName, lastName;

    @JsonIgnore
    private String salt, hash;

    @DynamoDBIgnore
    private String password;

    @DynamoDBHashKey(attributeName = "email")
    private String email;

    public String getSalt() {
        return salt;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void hashAndSavePassword() throws Exception{
        byte[] salt = SecureRandom.getInstance("SHA1PRNG").generateSeed(20);
        this.salt = salt.toString();
        String sha512hex = Hashing.sha512()
                .hashString(this.salt+this.password, StandardCharsets.UTF_8)
                .toString();
        this.hash = sha512hex;
        this.password = null;
    }

    public static boolean isPasswordCorrect(Manager user, String password){
        String sha512hex = Hashing.sha512()
                .hashString(user.salt+password, StandardCharsets.UTF_8)
                .toString();
        return sha512hex.equals(user.hash);
    }

}
