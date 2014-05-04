create table court_order (order_id bigSERIAL, order_user varchar(1024), order_time timestamp, courts_list text, status smallint);
create table court (plan_id bigSERIAL, court_id text, start_time smallint, end_time smallint, status smallint, price smallint, date_time date, last_time timestamp, last_user varchar(1024));
