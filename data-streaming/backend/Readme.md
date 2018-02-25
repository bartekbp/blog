### Prerequisites:
* postgresql 9.6
* java 8
* gradle

Default configuration expects db to be listening on localhost:5432,
user data-streaming, database data-streaming.
To create it, execute:
```
PS C:\Program Files\PostgreSQL\9.6\bin> .\createuser.exe  -U postgres data-streaming
PS C:\Program Files\PostgreSQL\9.6\bin> .\createdb.exe  -U postgres data-streaming
PS C:\Program Files\PostgreSQL\9.6\bin> .\psql.exe -U postgres
psql (9.6.7)
postgres=# alter user "data-streaming" with encrypted password 'data-streaming';
ALTER ROLE
postgres=# grant all privileges on database "data-streaming" to "data-streaming";
GRANT
```