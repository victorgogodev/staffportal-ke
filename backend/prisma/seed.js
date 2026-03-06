const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const users = [
    { firstName: 'Alice', lastName: 'Kamau', email: 'employee@staffportal.com', role: 'EMPLOYEE', department: 'Engineering' },
    { firstName: 'Brian', lastName: 'Otieno', email: 'manager@staffportal.com', role: 'MANAGER', department: 'Engineering' },
    { firstName: 'Carol', lastName: 'Wanjiku', email: 'hr@staffportal.com', role: 'HR', department: 'Human Resources' },
    { firstName: 'David', lastName: 'Mwangi', email: 'admin@staffportal.com', role: 'ADMIN', department: 'IT' }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, passwordHash: password }
    });
  }

  console.log('Seeded 4 users - one per role');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())