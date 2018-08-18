package models;

import io.ebean.Finder;
import models.base.User;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "MANAGERS")
public class Manager extends User {

    private String firstName, lastName;

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

    public static Finder<Long, Manager> find() {
        return new Finder<Long, Manager>(Manager.class);
    }
}
