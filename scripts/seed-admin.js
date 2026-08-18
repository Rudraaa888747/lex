const { PrismaClient } = require("../src/generated/prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || "your-admin@example.com"
  const password = process.env.ADMIN_PASSWORD || "change-me"
  const hashedPassword = await bcrypt.hash(password, 10)

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      name: "Rudra Admin",
    },
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name: "Rudra Admin",
    },
  })

  console.log("Admin user seeded successfully:", adminUser.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
