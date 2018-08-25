package models;

import models.base.BaseModel;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "ContestSubmissions")
public class ContestSubmission extends BaseModel {

    public enum State {
        Submitted,
        Processing,
        Processed
    }

    private String firstName, lastName, email, description;

    private State state;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }
}
