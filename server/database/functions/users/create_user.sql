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
$func$ LANGUAGE plpgsql;