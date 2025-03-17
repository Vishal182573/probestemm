#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
bun install

# Create SuperAdmin user
echo "Creating SuperAdmin user..."
bun run create-admin

# Ask if the user wants to change the password
echo ""
echo "Do you want to change the default SuperAdmin password now? (y/n)"
read change_password

if [ "$change_password" = "y" ] || [ "$change_password" = "Y" ]; then
  echo "Changing SuperAdmin password..."
  bun run change-admin-password
fi

# Start the application
echo "Starting the application..."
bun run dev

# Instructions
echo ""
echo "Admin panel is now available at http://localhost:5000/api/admin"
echo "Log in with the SuperAdmin credentials."
if [ "$change_password" != "y" ] && [ "$change_password" != "Y" ]; then
  echo "Default credentials:"
  echo "Email: admin@probestem.com"
  echo "Password: Admin@123"
  echo ""
  echo "IMPORTANT: Please change this password after your first login for security reasons."
  echo "You can change the password by running: bun run change-admin-password"
fi 