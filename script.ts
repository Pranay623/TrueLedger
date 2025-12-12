import  prisma  from './lib/prisma'

async function main() {
  // Create a new user with a certificate
  const user = await prisma.user.create({
    data: {
      email: "john@example.com",
      username: "john123",
      password: "hashed-password",
      fullName: "John Doe",
      securityId: "SEC123456",
      usertype: "STUDENT",
      certificates: {
        create: {
          name: "Python Basics",
          issueDate: new Date(),
          imageUrl: "https://example.com/certificate.png",
        },
      },
    },
    include: {
      certificates: true,
    },
  })

  console.log("Created user:", user)

  // Fetch all users with their certificates
  const allUsers = await prisma.user.findMany({
    include: {
      certificates: true,
    },
  })

  console.log("All users:", JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
