# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.26. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Probe STEM Admin Panel

This document provides instructions on how to set up and use the admin panel for the Probe STEM application.

## Admin Panel Setup

The admin panel is secured with authentication. Only SuperAdmin users can access the admin panel.

### Creating a SuperAdmin User

To create a SuperAdmin user, run the following command:

```bash
bun run create-admin
```

This will create a default SuperAdmin user with the following credentials:
- Email: admin@probestem.com
- Password: Admin@123

**IMPORTANT**: Please change this password after your first login for security reasons.

### Changing SuperAdmin Password

To change the SuperAdmin password, run the following command:

```bash
bun run change-admin-password
```

You will be prompted to enter the SuperAdmin email, new password, and confirm the new password.

### Accessing the Admin Panel

The admin panel is available at `/api/admin`. You will be prompted to log in with your SuperAdmin credentials.

### Environment Variables

The admin panel requires the following environment variables to be set in the `.env` file:

```
COOKIE_SECRET=your-secure-random-string-for-cookie-encryption
SESSION_SECRET=your-secure-random-string-for-session
```

These should be secure random strings used for encrypting cookies and sessions.

## Admin Panel Features

The admin panel provides access to manage all aspects of the Probe STEM application, including:

- Students
- Professors
- Businesses
- Discussions
- Blogs
- Projects
- Webinars
- FAQs
- Patents
- and more

## Security Considerations

- Always use strong passwords for SuperAdmin accounts
- Change the default password immediately after creation
- Keep your environment variables secure
- Consider implementing IP restrictions for the admin panel in production
