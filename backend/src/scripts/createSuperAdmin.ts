import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // Default admin credentials - should be changed after first login
    const email = 'admin@probestem.com';
    const password = 'Admin@123'; // This is just a default, should be changed immediately
    const name = 'Super Admin';

    // Check if admin already exists
    const existingAdmin = await prisma.superAdmin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Super Admin already exists with this email.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the super admin
    const superAdmin = await prisma.superAdmin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    console.log('Super Admin created successfully:', superAdmin.id);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('IMPORTANT: Please change this password after first login!');
  } catch (error) {
    console.error('Error creating Super Admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createSuperAdmin(); 