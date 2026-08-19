# BlindMaze Arcade

![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?logo=php&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript%20%2F%20JSX-React%2018-F7DF1E?logo=javascript&logoColor=111827)
![HTML](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

BlindMaze Arcade is a memory maze game. The player studies a 10×10 maze, waits for the walls to disappear, then finds the exit before time runs out.

The project uses Laravel 12 for the API and React with Tailwind CSS for the game interface.

## Gameplay

- Enter a username and start a run from the main menu.
- Memorize the maze for 10 seconds.
- Move through the hidden maze within 20 seconds.
- Start each run with 5 lives.
- Touching a wall or running out of time costs one life and restarts the stage.
- Use the stage hint once to reveal the walls for one second.
- Finish stages to increase the score and save the result to the highscore list.

The game includes a custom warning modal, instructions, leaderboard, keyboard controls, touch controls, and responsive portrait and landscape layouts.

## Tech stack

- Laravel 12 and PHP 8.2+
- Laravel Sanctum for the existing API authentication flow
- React 18
- Vite
- Tailwind CSS 4
- Axios
- SQLite by default for local development

## Project structure

```text
app/                 Laravel controllers and models
database/            Migrations, factories, and seeders
routes/api.php       Highscore and application API routes
FRONTEND/            React and Tailwind game interface
FRONTEND/src/game/   Maze generation, game constants, and score helpers
```

## Local setup

### 1. Install the Laravel dependencies

From the project root:

```bash
composer install
cp .env.example .env
php artisan key:generate
```

On Windows PowerShell, use this instead of `cp`:

```powershell
Copy-Item .env.example .env
```

Create the local SQLite database and run the migrations:

```bash
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate
```

### 2. Install the frontend dependencies

```bash
cd FRONTEND
cp .env.example .env
npm install
```

The frontend `.env` should point to the Laravel API:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Run the game

Open two terminals.

Terminal 1 — Laravel API:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2 — React frontend:

```bash
cd FRONTEND
npm run dev -- --host 127.0.0.1 --port 5173
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in the browser.

## Highscore API

Get the top scores:

```http
GET /api/highscores
```

Save a score:

```http
POST /api/highscores
Content-Type: application/json

{
  "username": "Naufal",
  "stage": 3,
  "score": 1200
}
```

The API returns the ten highest scores, ordered by score and stage.

## Checks

Run the backend tests from the project root:

```bash
php artisan test --compact
```

Run the frontend checks from `FRONTEND/`:

```bash
npm run lint
npm run build
```
