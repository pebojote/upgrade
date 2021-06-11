--- START OF database/functions/users/find_user_by_email.sql --- 
CREATE OR REPLACE FUNCTION public.find_user_by_email(
  p_email VARCHAR
) RETURNS TABLE (
  id INT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  phone_number VARCHAR(255),
  status enum_users_status,
  phone_verified BOOLEAN,
  email_verified BOOLEAN,
  activation_code TEXT
) AS $func$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.password,
    u.phone_number,
    u.status,
    u.phone_verified,
    u.email_verified,
    u.activation_code
  FROM public.users AS u
  WHERE
    u.email = p_email
  LIMIT 1;
END;
$func$ LANGUAGE plpgsql;--- END OF database/functions/users/find_user_by_email.sql --- 

--- START OF database/functions/users/create_user.sql --- 
CREATE OR REPLACE FUNCTION public.create_user(
  p_first_name VARCHAR(255),
  p_last_name VARCHAR(255),
  p_email VARCHAR(255),
  p_password VARCHAR(255),
  p_phone_number VARCHAR(255)
) RETURNS TABLE (
  id INT,
  status VARCHAR(50),
  message VARCHAR(255)
) AS $func$
DECLARE
  v_id INT := 0;
  v_status VARCHAR(50) := 'success';
  v_message VARCHAR(255) := 'Registration successful!';
BEGIN
  IF EXISTS (
    SELECT
      u.id
    FROM
      public.users AS u
    WHERE
      u.email = p_email
  ) THEN
    v_status := 'error';
    v_message := CONCAT(p_email, ' already exists.');
    RETURN QUERY
    SELECT v_id, v_status, v_message;
    RETURN;
  END IF;

  INSERT INTO public.users (
    first_name,
    last_name,
    email,
    password,
    phone_number
  ) VALUES (
    p_first_name,
    p_last_name,
    p_email,
    p_password,
    p_phone_number
  ) RETURNING public.users.id INTO v_id;

  RETURN QUERY
  SELECT v_id, v_status, v_message;
END;
$func$ LANGUAGE plpgsql;--- END OF database/functions/users/create_user.sql --- 

