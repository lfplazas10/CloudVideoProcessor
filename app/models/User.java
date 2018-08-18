package models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.hash.Hashing;
import io.ebean.Finder;
import io.ebean.Model;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

@Entity
@Table(name = "USERS")
public class User extends Model {

    @JsonInclude()
    @Transient
    private String password;

    @JsonIgnore
    private String salt, hash;

    @Id
    private String email;

    public static Finder<Long, User> find() {
        return new Finder<Long, User>(User.class);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSalt() {
        return salt;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public static boolean isPasswordCorrect(User user, String password){
        String sha512hex = Hashing.sha512()
                .hashString(user.salt+password, StandardCharsets.UTF_8)
                .toString();
        return sha512hex.equals(user.hash);
    }


}
