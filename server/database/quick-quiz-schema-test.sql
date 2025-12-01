drop database if exists quick_quiz_test;
create database quick_quiz_test;
use quick_quiz_test;

-- create table and relationships
create table app_user (
    user_id int primary key auto_increment,
    first_name varchar(25) not null,
    last_name varchar(25) not null,
    username varchar(50) not null unique,
    password varchar(2048) not null,
    disabled boolean not null default(0)
);

create table teacher (
    teacher_id int primary key auto_increment,
    user_id int not null,
    constraint fk_teacher_user_id
        foreign key (user_id)
        references app_user(user_id)
);

create table quiz (
    quiz_id int primary key auto_increment,
    teacher_id int not null,
    title varchar(25) not null,
    description varchar(250) not null,
    number_of_questions int not null,
    number_of_options int not null,
    topic varchar(25) not null,
    prompt varchar(250) not null,
    quiz_json text not null,
    constraint fk_quiz_teacher_id
        foreign key (teacher_id)
        references teacher(teacher_id)
);

create table question (
    question_id int primary key auto_increment,
    quiz_id int not null,
    question_text varchar(250) not null,
    constraint fk_question_quiz_id
        foreign key (quiz_id)
        references quiz(quiz_id)
);

create table score (
    score_id int primary key auto_increment,
    user_id int not null,
    quiz_id int not null,
    score decimal(10, 2) not null,
    constraint fk_score_user_id
        foreign key (user_id)
        references app_user(user_id),
    constraint fk_score_quiz_id
        foreign key (quiz_id)
        references quiz(quiz_id)
);

create table `option` (
    option_id int primary key auto_increment,
    question_id int not null,
    option_text varchar(250),
    is_correct boolean not null default(0),
    constraint fk_option_question_id
        foreign key (question_id)
        references question(question_id)
);

create table result (
    result_id int primary key auto_increment,
    user_id int not null,
    quiz_id int not null,
    question_id int not null,
    option_id int not null,
    constraint fk_result_user_id
        foreign key (user_id)
        references app_user(user_id),
    constraint fk_result_quiz_id
        foreign key (quiz_id)
        references quiz(quiz_id),
    constraint fk_result_question_id
        foreign key (question_id)
        references question(question_id),
    constraint fk_result_option_id
        foreign key (option_id)
        references `option`(option_id)
);

create table role (
    role_id int primary key auto_increment,
    `name` varchar(50) not null unique
);

create table user_role (
    user_id int not null,
    role_id int not null,
    constraint pk_user_role
        primary key (user_id, role_id),
    constraint fk_user_role_user_id
        foreign key (user_id)
        references app_user(user_id),
    constraint fk_user_role_role_id
        foreign key (role_id)
        references role(role_id)
);

create table quiz_result (
    quiz_result_id int primary key auto_increment,
    user_id int not null,
    quiz_id int not null,
    correct_answers int not null,
    total_questions int not null,
    percent_correct decimal(10, 2) not null,
    constraint fk_quiz_result_user_id
        foreign key (user_id)
        references app_user(user_id),
    constraint fk_quiz_result_quiz_id
        foreign key (quiz_id)
        references quiz(quiz_id)
);

delimiter //
create procedure set_known_good_state()
begin

	delete from quiz_result;
    alter table quiz_result auto_increment = 1;
    delete from result;
    alter table result auto_increment = 1;
    delete from `option`;
    alter table `option` auto_increment = 1;
    delete from question;
    alter table question auto_increment = 1;
    delete from score;
    alter table score auto_increment = 1;
    delete from quiz;
    alter table quiz auto_increment = 1;




	insert into quiz(quiz_id, teacher_id, title, description, number_of_questions, number_of_options, topic, prompt, quiz_json) values
		(1, 1, "First Quiz", "First Quiz Description", 3, 3, "test", "give me a test quiz with 3 questions and 3 options", "");

	insert into question(question_id, quiz_id, question_text) values
		(1, 1, "First Question"),
		(2, 1, "Second Question"),
		(3, 1, "Third Question");

	insert into score(score_id, user_id, quiz_id, score) values
		(1, 1, 1, 66.67);

	insert into `option`(option_id, question_id, option_text, is_correct) values
		(1, 1, "Option 1 for Question 1", 1),
		(2, 1, "Option 2 for Question 1", 0),
		(3, 1, "Option 3 for Question 1", 0),
		(4, 2, "Option 1 for Question 2", 0),
		(5, 2, "Option 2 for Question 2", 1),
		(6, 2, "Option 3 for Question 2", 0),
		(7, 3, "Option 1 for Question 3", 0),
		(8, 3, "Option 2 for Question 3", 0),
		(9, 3, "Option 3 for Question 3", 1);

	insert into result(result_id, user_id, quiz_id, question_id, option_id) values
		(1, 1, 1, 1, 1),
		(2, 1, 1, 2, 2),
		(3, 1, 1, 3, 1);

    insert into quiz_result(quiz_result_id, user_id, quiz_id, correct_answers, total_questions, percent_correct) values
        (1, 2, 1, 2, 3, 66.66);

end //
delimiter ;

insert into app_user(user_id, first_name, last_name, username, password, disabled) values
	(1, "Teacher", "Person", "teacher@person.com", "password", 0),
	(2, "Student", "Quiztaker", "student@quiztaker.com", "password", 0);

insert into teacher(teacher_id, user_id) values
	(1, 1);

insert into role(role_id, `name`) values
    (1, "Student"),
    (2, "Teacher");

insert into user_role(user_id, role_id) values
    (1, 2),
    (2, 1);

