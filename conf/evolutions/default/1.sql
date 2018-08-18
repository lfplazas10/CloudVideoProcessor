# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table managers (
  email                         varchar(255) not null,
  salt                          varchar(255),
  hash                          varchar(255),
  first_name                    varchar(255),
  last_name                     varchar(255),
  constraint pk_managers primary key (email)
);


# --- !Downs

drop table if exists managers cascade;

