CREATE TABLE devices (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(100) NOT NULL,
  api_key varchar(64) NOT NULL UNIQUE,
  category varchar(50) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
