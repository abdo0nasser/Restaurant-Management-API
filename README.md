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
MONGO_URI=mongodb://localhost:27017/restaurant
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

### Useful endpoints

- `POST /auth/login` — get JWT token (see `auth` module)
- `POST /restaurant` — create restaurant (requires JWT)
- `GET /restaurant` — list restaurants
- `GET /user/recommendations` — get recommended restaurants based on similar users (requires JWT)


### Developer notes

- Aggregation logic (recommendations) lives in `src/modules/user/user.repository.ts`. Comments are added in-place to explain the MongoDB aggregation pipeline stages.
- Swagger decorators (`@ApiProperty`, `@ApiResponse`, etc.) are used across DTOs and controllers to generate accurate API docs.
