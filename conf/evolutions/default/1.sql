# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table users (
  email                         varchar(255) not null,
  salt                          varchar(255),
  hash                          varchar(255),
  constraint pk_users primary key (email)
);


# --- !Downs

drop table if exists users cascade;

