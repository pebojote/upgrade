CREATE OR REPLACE FUNCTION public.find_user_by_id(
  p_id INT
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
    u.id = p_id
  LIMIT 1;
END;
$func$ LANGUAGE plpgsql;