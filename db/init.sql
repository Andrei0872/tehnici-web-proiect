create table law_firm (
  name varchar(50) not null primary key,
  created_at timestamp
);

create table lawyer (
  -- a
  id serial primary key,
  -- b
  name varchar(100) not null,
  -- c
  descr varchar(200) not null,
  -- d
  img_path varchar(255) not null,
  -- e - the _big_ category
  specialization varchar(50) not null,
  -- f - the _small_ category
  city_name varchar(50) not null,
  -- g
  salary int not null,
  -- h
  years_experience int not null,
  -- i
  started_at date not null,
  -- j
  works_for varchar(50) not null,
  -- k
  hobbies text[],
  -- l
  has_free_trial boolean,

  foreign key(works_for) references law_firm(name)
);

insert into law_firm
values('law-firm-1'),
      ('law-firm-2'),
      ('law-firm-3');

insert into lawyer(name, descr, img_path, specialization, city_name, salary, years_experience, started_at, works_for, hobbies, has_free_trial)
values('lawyer-name-1', 'desc-1', 'path-1', 'criminal', 'city1', 5000, 4, '2021-04-19', 'law-firm-1', '{"reading", "football"}', false),
      ('lawyer-name-2', 'desc-2', 'path-1', 'medical', 'city1', 2000, 2, '2021-04-19', 'law-firm-1', '{"football"}', false),
      ('lawyer-name-3', 'desc-3', 'path-1', 'medical', 'city1', 8000, 8, '2021-04-19', 'law-firm-2', '{"reading", "teaching"}', true),
      ('lawyer-name-4', 'desc-4', 'path-1', 'criminal', 'city1', 5600, 4, '2021-04-19', 'law-firm-3', '{"travelling"}', true),
      ('lawyer-name-5', 'desc-5', 'path-1', 'family', 'city1', 6500, 5, '2021-04-19', 'law-firm-3', '{"reading", "travelling"}', false),
      ('lawyer-name-6', 'desc-6', 'path-1', 'family', 'city1', 7600, 6, '2021-04-19', 'law-firm-2', '{"jogging", "travelling"}', true),
      ('lawyer-name-7', 'desc-7', 'path-1', 'criminal', 'city1', 12000, 12, '2021-04-19', 'law-firm-3', '{}', true),
      ('lawyer-name-8', 'desc-8', 'path-1', 'labor', 'city1', 3500, 1, '2021-04-19', 'law-firm-2', '{"tennis"}', true),
      ('lawyer-name-9', 'desc-9', 'path-1', 'criminal', 'city1', 8000, 8, '2021-04-19', 'law-firm-2', '{"coffee", "history"}', false),
      ('lawyer-name-10', 'desc-10', 'path-1', 'medical', 'city1', 4300, 4, '2021-04-19', 'law-firm-2', '{"reading", "football"}', true),
      ('lawyer-name-11', 'desc-11', 'path-1', 'criminal', 'city1', 5200, 6, '2021-04-19', 'law-firm-3', '{"reading", "football"}', false),
      ('lawyer-name-12', 'desc-12', 'path-1', 'criminal', 'city1', 5000, 7, '2021-04-19', 'law-firm-1', '{"reading", "football"}', true),
      ('lawyer-name-13', 'desc-13', 'path-1', 'labor', 'city1', 9300, 10, '2021-04-19', 'law-firm-1', '{"reading", "football"}', false),
      ('lawyer-name-14', 'desc-14', 'path-1', 'labor', 'city1', 4500, 3, '2021-04-19', 'law-firm-3', '{"reading", "football"}', true),
      ('lawyer-name-15', 'desc-15', 'path-1', 'family', 'city1', 9000, 9, '2021-04-19', 'law-firm-1', '{"reading", "football"}', false);