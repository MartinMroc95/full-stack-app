# Full Stack Car Marketplace Application

A modern full-stack application for managing car listings with user authentication, subscription management, and payment processing. This application provides a complete solution for car dealerships or individual sellers to manage their inventory with a subscription-based business model.

## Tech Stack

### Frontend

- **Next.js 14** - React framework with server-side rendering and API routes
- **React 18** - UI library with hooks and concurrent features
- **Apollo Client** - GraphQL client for data fetching and state management
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built with Radix UI and TailwindCSS
- **Framer Motion** - Animation library for React
- **React Hook Form** - Form validation and handling
- **Yup** - Schema validation

### Backend

- **GraphQL** - API query language
- **Pothos** - Code-first GraphQL schema builder
- **Prisma ORM** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **Auth0** - Authentication and authorization
- **Stripe** - Payment processing and subscription management

### Development Tools

- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Playwright** - End-to-end testing

## Features

### User Management

- Secure authentication with Auth0
- Role-based access control (Admin/User)
- User profile management
- Session handling and token management

### Car Listings

- Create, read, update, and delete car listings
- Detailed car information including:
  - Brand and model
  - Year and mileage
  - Fuel type and engine power
  - Price and description
- Image upload and management
- Search and filtering capabilities

### Subscription System

- Multiple subscription tiers
- Stripe integration for payment processing
- Automated billing and invoicing
- Subscription status tracking
- Payment history and receipts

### Invoice Management

- Automated invoice generation
- Payment status tracking
- Invoice history
- Export capabilities

## Architecture

### Database Schema

The application uses a relational database with the following main entities:

- **User**: Authentication and profile information
- **Car**: Vehicle listings with detailed specifications
- **Subscription**: User subscription details and status
- **Invoice**: Payment records and billing information

### API Structure

- GraphQL API with Pothos schema builder
- Type-safe resolvers with Prisma integration
- Real-time updates with GraphQL subscriptions
- Optimized queries with Apollo Client

### Frontend Architecture

- Component-based architecture
- Responsive design with TailwindCSS
- State management with Apollo Client
- Form handling with React Hook Form
- Client-side validation with Yup

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (v14 or higher)
- Auth0 account with configured application
- Stripe account with API keys
- Git for version control

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"

# Auth0
AUTH0_SECRET=''
AUTH0_BASE_URL=''
AUTH0_ISSUER_BASE_URL=''
AUTH0_CLIENT_ID=''
AUTH0_CLIENT_SECRET=''

# Stripe
STRIPE_SECRET_KEY=''
STRIPE_WEBHOOK_SECRET=''
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=''
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd full-stack-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Seed the database (optional):

   ```bash
   npx prisma db seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Playwright tests
- `npm run test:ui` - Run tests with UI
- `npm run test:debug` - Run tests in debug mode

### Code Style

- Follows Airbnb JavaScript Style Guide
- Uses Prettier for code formatting
- ESLint for code linting
- TypeScript for type safety

### Git Workflow

- Feature branches for new development
- Pull requests for code review
- Husky pre-commit hooks for code quality
- Conventional commits for version control

## Project Structure

```
├── graphql/           # GraphQL schema and resolvers
│   ├── builder.ts     # Schema builder configuration
│   ├── context.ts     # GraphQL context
│   ├── schema.ts      # Schema definition
│   └── types/         # Type definitions
├── lib/               # Shared utilities
│   ├── apollo.ts      # Apollo client configuration
│   └── prisma.ts      # Prisma client
├── prisma/            # Database configuration
│   ├── schema.prisma  # Database schema
│   └── migrations/    # Database migrations
├── public/            # Static assets
├── src/               # Next.js application
│   ├── components/    # React components
│   ├── pages/         # Next.js pages
│   └── routes/        # Application routes
└── tests/             # Test files
```

## Testing

### Unit Tests

- Component testing with React Testing Library
- API testing with Jest
- Database testing with Prisma

### Integration Tests

- API integration tests
- Database integration tests
- Authentication flow tests

### E2E Tests

- User flow testing with Playwright
- Cross-browser testing
- Mobile responsiveness testing

## Deployment

### Production Build

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

### Environment Setup

- Configure production environment variables
- Set up production database
- Configure Auth0 production settings
- Set up Stripe production webhooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
