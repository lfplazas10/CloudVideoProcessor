package models.base;

import io.ebean.Finder;
import io.ebean.Model;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseModel extends Model {
    @Id
    long id;

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

//    @Override
//    public static<T extends BaseModel> Finder<Long, T> find(Class<T> type){
//        return new Finder<>(type);
//    };

//    public static Finder<Long, ?> find(){
//        return null;
//    };
}
