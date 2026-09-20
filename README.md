# Where's Waldo? — Photo Tagging Game

A full-stack photo-tagging game inspired by **Where's Waldo?**

The goal is simple: find **Waldo, Wizard, and Odlaw** in a busy image as quickly as possible.

The project was built as part of [The Odin Project](https://www.theodinproject.com/) NodeJS curriculum.

## Features

* Start a new game
* Responsive game image
* Click anywhere on the image to select a location
* Choose which character you think is at that location
* Server-side validation of guesses
* Visual targeting box
* Correct-location markers
* Character headshots showing which characters have been found
* Game completion detection
* Server-side game timing
* Submit your name and save your score
* Persistent leaderboard
* Play again without refreshing the page
* Loading and error states

## Tech Stack

### Frontend

* React
* JavaScript
* Vite
* CSS
* Fetch API

### Backend

* Node.js
* Express
* Prisma
* PostgreSQL
* REST API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: PostgreSQL

## How It Works

When a player starts a game, the frontend requests a new game from the backend.

```text
POST /api/games
```

The backend creates a `Game` record and stores the time the game started.

When the player clicks the image and selects a character, the frontend sends the original image coordinates to the backend:

```text
POST /api/games/:id/guess
```

The backend compares the submitted coordinates with the stored coordinates for that character.

A guess is considered correct when the distance between the player's click and the character's stored position is within the character's tolerance.

When all three characters have been found, the frontend completes the game:

```text
POST /api/games/:id/complete
```

The backend records the completion time and calculates the player's total game time.

The player can then submit their name:

```text
POST /api/scores
```

Scores can be retrieved with:

```text
GET /api/scores
```

The leaderboard is sorted by completion time, with faster times appearing first.

## Coordinate System

The game image has an original size of:

```text
1024 × 768
```

Character locations are stored using the image's original coordinate system.

The frontend converts the user's click from the displayed image dimensions back to the original image dimensions before sending it to the backend.

This allows the game to remain accurate even when the image is displayed at different sizes on different screens.

## Database Schema

The application uses three main models.

### Game

Stores information about an individual game session.

```text
Game
├── id
├── startedAt
└── completedAt
```

### Character

Stores the location of each character.

```text
Character
├── id
├── name
├── x
├── y
└── tolerance
```

### Score

Stores completed game scores.

```text
Score
├── id
├── name
├── time
├── createdAt
└── gameId
```

## API Endpoints

| Method | Endpoint                  | Purpose                     |
| ------ | ------------------------- | --------------------------- |
| POST   | `/api/games`              | Start a new game            |
| POST   | `/api/games/:id/guess`    | Submit a character guess    |
| POST   | `/api/games/:id/complete` | Complete a game             |
| POST   | `/api/scores`             | Save a score                |
| GET    | `/api/scores`             | Retrieve leaderboard scores |

## Project Structure

### Frontend

```text
src/
├── assets/
│   ├── waldo.png
│   ├── waldoImg.png
│   ├── Headshot_-_Wizard.webp
│   └── Headshot_-_Odlaw.webp
│
├── components/
│   ├── Game.jsx
│   ├── GameImage.jsx
│   └── Leaderboard.jsx
│
├── services/
│   └── gameApi.js
│
├── App.jsx
└── main.jsx
```

### Backend

The backend follows an Express controller/router structure.

```text
src/
├── controllers/
│   ├── gameController.js
│   └── scoreController.js
│
├── routes/
│   ├── gameRoutes.js
│   └── scoreRoutes.js
│
├── db/
│   └── prisma.js
│
└── app.js
```

## Environment Variables

The frontend uses an environment variable for the backend API URL.

### Local development

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

### Production

Set the environment variable in your hosting provider:

```env
VITE_API_URL=https://your-backend-url/api
```

This prevents the frontend code from having to be changed whenever the application moves between local development and production.

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

Navigate into the backend directory and run:

```bash
npm install
```

### 4. Configure the database

Create a `.env` file in the backend:

```env
DATABASE_URL=your_postgresql_connection_string
```

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 6. Seed the characters

```bash
npm run seed
```

### 7. Start the backend

```bash
npm run dev
```

### 8. Start the frontend

In the frontend directory:

```bash
npm run dev
```

The application should now be available through the Vite development server.

## Deployment

The project can be deployed as two separate applications:

```text
                 ┌─────────────────┐
                 │     Vercel      │
                 │ React Frontend  │
                 └────────┬────────┘
                          │
                          │ REST API
                          ▼
                 ┌─────────────────┐
                 │     Render      │
                 │ Express Backend │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   PostgreSQL    │
                 │    Database     │
                 └─────────────────┘
```

The frontend communicates with the deployed Express API using the `VITE_API_URL` environment variable.

## What I Learned

This project helped me practice several full-stack concepts:

* Building a React application with multiple components
* Managing state with React hooks
* Using `useRef` and `getBoundingClientRect()`
* Converting coordinates between displayed and original image dimensions
* Building REST API endpoints with Express
* Separating routes and controllers
* Using Prisma with PostgreSQL
* Validating data on the server
* Working with relational database models
* Calculating elapsed time on the server
* Connecting a React frontend to an Express backend
* Managing environment variables
* Deploying a frontend and backend separately
* Building a persistent leaderboard

## Future Improvements

Possible improvements include:

* Better protection against submitting the same score multiple times
* Server-side verification that all characters have actually been found before completing a game
* Improved leaderboard pagination
* Difficulty levels with different images
* Multiple game images
* Improved animations and sound effects
* More detailed game statistics

## Author

**Ahmad Mahmud**

Computer Science undergraduate and full-stack developer in training.

Built with React, Node.js, Express, Prisma and PostgreSQL.
