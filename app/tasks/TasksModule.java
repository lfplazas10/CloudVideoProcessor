package tasks;

import com.google.inject.AbstractModule;

public class TasksModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(CodeBlockTask.class).asEagerSingleton();
    }
}