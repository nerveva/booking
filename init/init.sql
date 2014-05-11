create table court_order (order_id text not null, order_user varchar(1024) not null, order_time timestamp, courts_list text not null, total_price smallint not null, status smallint not null, trade_no text);
alter table court_order alter column order_time set default current_timestamp(0)::timestamp without time zone;
create table court (plan_id bigSERIAL, court_id text not null, venue_id bigint not null, court_name text not null, start_time smallint not null, end_time smallint not null, status smallint not null, price smallint not null, date_time date, last_time timestamp, last_user varchar(1024));
create table venue (venue_id bigSERIAL, venue_name text not null, court_list text not null, start_time smallint not null, end_time smallint not null, price_policy text not null, introduction text, brief_intro text, venue_user varchar(1024) not null, status smallint not null, venue_uri text, ext text);
create table user_table (user_id bigSERIAL, user_name varchar(1024) not null, user_role smallint, phone varchar(128), email varchar(128), member smallint, create_time timestamp);
alter table user_table alter column create_time set default current_timestamp(0)::timestamp without time zone;
