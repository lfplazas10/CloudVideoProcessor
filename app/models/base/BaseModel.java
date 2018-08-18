package models.base;

import io.ebean.Finder;
import io.ebean.Model;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseModel extends Model {
    @Id
    long id;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
