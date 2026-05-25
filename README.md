## Restaurant API service

NestJS-based backend for restaurant discovery and recommendations.

### Install

```bash
npm install
```

### Environment

Create a `.env` file at the project root (or use env vars). Common variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign JWT tokens
- `PORT` - server port (default 3000)

Example `.env`:

```
MONGO_URL=mongodb://localhost:27017/restaurant
JWT_SECRET=change_this_to_a_strong_secret
PORT=3000
```

### Run

```bash
# development
npm run start

# watch mode (hot reload)
npm run start:dev
```

### API documentation (Swagger)

The project exposes Swagger docs at `api/docs` when running. Open:

http://localhost:3000/api/docs

### Endpoints

#### Auth (public)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Sign in and get JWT token |

#### Restaurants

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/restaurant` | — | List all restaurants (filter by `cuisine`, paginate with `page` & `limit`) |
| GET | `/api/restaurant/id/:id` | — | Get restaurant by MongoDB ObjectId |
| GET | `/api/restaurant/:slug` | — | Get restaurant by slug |
| GET | `/api/restaurant/nearby` | — | Find nearby restaurants (query: `latitude`, `longitude`, `page`, `limit`) |
| GET | `/api/restaurant/most-followed` | — | Most followed restaurants (paginated) |
| POST | `/api/restaurant` | JWT | Create a new restaurant |

#### Users (all require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/user` | List all users |
| GET | `/api/user/:id` | Get user by ID |
| GET | `/api/user/follows` | Get restaurants the current user follows |
| GET | `/api/user/recommendations` | Get personalized restaurant recommendations |
| POST | `/api/user/follow/:restaurantId` | Follow a restaurant |
| DELETE | `/api/user/follow/:restaurantId` | Unfollow a restaurant |

#### System

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |


### Developer notes

- Aggregation logic (recommendations) lives in `src/modules/user/user.repository.ts`. Comments are added in-place to explain the MongoDB aggregation pipeline stages.
- Swagger decorators (`@ApiProperty`, `@ApiResponse`, etc.) are used across DTOs and controllers to generate accurate API docs.
