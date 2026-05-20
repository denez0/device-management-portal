# Device Management Portal (concept demo)

A fullstack web application inspired by internal IT device portals. Users can view devices, submit support requests, and track orders. Built as a learning project to explore Next.js 14, TypeScript, Prisma, and Tailwind.

## Technologies

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Zod
- Jest

Also used: next-intl, next-themes, shadcn/ui

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd bosch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Apply database migrations

```bash
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run tests

```bash
npm test
```

## Screenshots

_Screenshots will be added here._

## AI Disclosure

This project was developed with assistance from AI coding tools (Cursor + Claude). I focused on architecture decisions, debugging, validation logic, and understanding core concepts like React Server Components, API routes, and database schemas.

## Disclaimer

This is an **independent learning project** created for portfolio purposes. 

- Not affiliated with, endorsed by, or connected to **Bosch**, **My Mobile**, or any other company mentioned as inspiration.
- All trademarks (Bosch, My Mobile, Next.js, etc.) are property of their respective owners.
- This project contains no proprietary code, assets, or confidential information from any company.
- Built to demonstrate proficiency with Next.js, TypeScript, Prisma, and modern web development practices.

## Author

Denys Yakovliev – Physics student at University of Warsaw

## License

MIT
