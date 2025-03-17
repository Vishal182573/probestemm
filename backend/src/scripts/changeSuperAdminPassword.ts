import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function changeSuperAdminPassword() {
  try {
    // Get the email of the SuperAdmin
    const email = await new Promise<string>((resolve) => {
      rl.question('Enter SuperAdmin email: ', (answer) => {
        resolve(answer);
      });
    });

    // Check if admin exists
    const existingAdmin = await prisma.superAdmin.findUnique({
      where: { email },
    });

    if (!existingAdmin) {
      console.log('No SuperAdmin found with this email.');
      rl.close();
      return;
    }

    // Get the new password
    const newPassword = await new Promise<string>((resolve) => {
      rl.question('Enter new password: ', (answer) => {
        resolve(answer);
      });
    });

    // Confirm the new password
    const confirmPassword = await new Promise<string>((resolve) => {
      rl.question('Confirm new password: ', (answer) => {
        resolve(answer);
      });
    });

    if (newPassword !== confirmPassword) {
      console.log('Passwords do not match.');
      rl.close();
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the SuperAdmin password
    await prisma.superAdmin.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log('Password updated successfully.');
  } catch (error) {
    console.error('Error changing SuperAdmin password:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run the function
changeSuperAdminPassword(); 