🚀 Tech Stack Used
Layer	Technology
Frontend	Next.js (React)
Backend	Next.js server actions
Authentication	next cokkee session
Database	Prisma with mysql
Styling	Tailwind CSS and shadcn 
Package Manager	npm


🛡️ Authentication Flow

The authentication flow in this project follows a Signup → Login → Dashboard pattern:

User Signup

New users first register using the Signup page by providing required details (e.g., name, email, password).

On successful signup, the user is automatically redirected to the Login page.

User Login

The user logs in using their registered email and password.

Credentials are sent to the backend authentication API.

The backend validates the credentials against the database.

Session / Token Creation

After successful validation, an authentication token or session is created.

The token/session is securely stored (e.g., HTTP-only cookies or session storage).

Redirect to Dashboard

Once authenticated, the user is redirected to the Dashboard.

The dashboard is a protected route and can only be accessed by logged-in users.

Protected Routes

Any attempt to access the dashboard without authentication redirects the user back to the Login page.


📊 Database Schema Explanation

Here’s a simple conceptual 

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  status    TaskStatus @default(TODO)
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}