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
values('lawyer-name-1', 'excellent worker', 'images/lawyers/temp-1.webp', 'criminal', 'Bucharest', 5000, 4, '2021-05-31', 'law-firm-1', '{"reading", "football"}', false),
      ('lawyer-name-2', 'just graduated', 'images/lawyers/temp-2.webp', 'medical', 'Linz', 3500, 2, '2021-04-19', 'law-firm-1', '{"football"}', false),
      ('lawyer-name-3', 'criminal law background', 'images/lawyers/temp-2.webp', 'medical', 'Linz', 8000, 8, '2019-03-19', 'law-firm-2', '{"reading", "teaching"}', true),
      ('lawyer-name-4', 'labor law background', 'images/lawyers/temp-2.webp', 'criminal', 'Bucharest', 5600, 4, '2020-03-11', 'law-firm-3', '{"travelling"}', true),
      ('lawyer-name-5', 'criminal law background', 'images/lawyers/temp-1.webp', 'family', 'Bremen', 6500, 5, '2021-09-13', 'law-firm-3', '{"reading", "travelling"}', false),
      ('lawyer-name-6', 'expensive, but worth it', 'images/lawyers/temp-1.webp', 'family', 'Linz', 7600, 6, '2021-04-14', 'law-firm-2', '{"jogging", "travelling"}', true),
      ('lawyer-name-7', 'excellent and dedicated worker', 'images/lawyers/temp-3.webp', 'criminal', 'Bucharest', 12000, 12, '2021-12-19', 'law-firm-3', '{}', true),
      ('lawyer-name-8', 'sometimes lazy', 'images/lawyers/temp-3.webp', 'labor', 'Bucharest', 3500, 1, '2020-07-19', 'law-firm-2', '{"tennis"}', true),
      ('lawyer-name-9', 'expensive, but worth it', 'images/lawyers/temp-3.webp', 'criminal', 'Linz', 8000, 8, '2019-07-29', 'law-firm-2', '{"coffee", "history"}', false),
      ('lawyer-name-10', 'expensive, but worth it. criminal law background', 'images/lawyers/temp-1.webp', 'medical', 'Bucharest', 4300, 4, '2019-04-19', 'law-firm-2', '{"reading", "football"}', true),
      ('lawyer-name-11', 'family law background', 'images/lawyers/temp-4.webp', 'criminal', 'Linz', 5200, 6, '2018-01-14', 'law-firm-3', '{"reading", "football"}', false),
      ('lawyer-name-12', 'family law background', 'images/lawyers/temp-5.webp', 'criminal', 'Bucharest', 5000, 7, '2019-07-26', 'law-firm-1', '{"reading", "football"}', true),
      ('lawyer-name-13', 'good negotiator', 'images/lawyers/temp-4.webp', 'labor', 'Bremen', 9300, 10, '2020-06-6', 'law-firm-1', '{"reading", "football"}', false),
      ('lawyer-name-14', 'young and eager to learn', 'images/lawyers/temp-5.webp', 'labor', 'Bremen', 4500, 3, '2021-10-19', 'law-firm-3', '{"reading", "football"}', true),
      ('lawyer-name-15', 'sometimes lazy', 'images/lawyers/temp-1.webp', 'family', 'Bremen', 9000, 9, '2021-9-12', 'law-firm-1', '{"reading", "football"}', false);