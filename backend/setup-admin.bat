@echo off
echo Installing dependencies...
call bun install

echo Creating SuperAdmin user...
call bun run create-admin

echo.
set /p change_password=Do you want to change the default SuperAdmin password now? (y/n): 

if /i "%change_password%"=="y" (
  echo Changing SuperAdmin password...
  call bun run change-admin-password
)

echo Starting the application...
call bun run dev

echo.
echo Admin panel is now available at http://localhost:5000/api/admin
echo Log in with the SuperAdmin credentials.
if /i not "%change_password%"=="y" (
  echo Default credentials:
  echo Email: admin@probestem.com
  echo Password: Admin@123
  echo.
  echo IMPORTANT: Please change this password after your first login for security reasons.
  echo You can change the password by running: bun run change-admin-password
) 