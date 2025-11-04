-- Este script se ejecuta como superusuario (POSTGRES_USER, 'root' en tu caso)

-- 1. Crear el usuario para tu aplicación/tests (no superusuario)
CREATE USER app_user WITH PASSWORD 'app_password';

-- 2. Conceder privilegios básicos de conexión y base de datos
-- El usuario 'root' es el dueño de la base de datos 'local' creada por Docker,
-- así que 'app_user' necesita permisos para usarla.
GRANT CONNECT ON DATABASE local TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- 3. Configurar permisos por defecto para futuras tablas/secuencias/tipos creadas en el esquema public
-- Esto es CRÍTICO para que 'app_user' pueda acceder a las tablas que Drizzle creará después.
ALTER DEFAULT PRIVILEGES FOR ROLE root IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

ALTER DEFAULT PRIVILEGES FOR ROLE root IN SCHEMA public
GRANT USAGE ON SEQUENCES TO app_user;

-- Establecer el search_path por defecto para el usuario
ALTER ROLE app_user SET search_path TO public;

-- Opcional: Crear un usuario para migraciones (si quieres uno distinto al superusuario 'root' para migraciones)
-- CREATE USER migration_user WITH PASSWORD 'migration_password';
-- GRANT migration_user TO root; -- Concede a migration_user la capacidad de actuar como root (si es necesario para migraciones complejas, aunque mejor darle permisos directos)
-- GRANT ALL PRIVILEGES ON DATABASE local TO migration_user; -- O privilegios más específicos

-- Si usas un usuario de migración, asegura que también tenga privilegios default para futuras creaciones.


ALTER DEFAULT PRIVILEGES FOR ROLE root IN SCHEMA public
GRANT USAGE ON TYPES TO app_user;
--ALTER DEFAULT PRIVILEGES FOR ROLE root IN SCHEMA public
--GRANT USAGE ON TYPES TO migration_user;

CREATE EXTENSION IF NOT EXISTS pgcrypto;