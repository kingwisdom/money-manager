# Money Manager

A dark-themed personal finance app that tracks bills, budgets, income and expenses, with due-date reminders. Built with Laravel 12, Inertia v2, React 19, and Tailwind CSS 4.

## Features

- **Bills** — recurring bills with due dates, monthly/yearly frequency, auto-pay flags, and paid history
- **Reminders** — daily `bills:check-due` job creates notifications for bills due soon or overdue
- **Budgets** — monthly budget per expense category with progress bars
- **Incomes & Expenses** — tracked against categories, with a 6-month dashboard chart
- **Categories** — organize both income and expense categories (seeded per user on registration)
- **Dashboard** — month-to-date summary, upcoming bills, budget progress, recent transactions
- **Currency** — per-user currency symbol (default from `APP_CURRENCY`)

## Requirements

- PHP 8.2+
- Composer 2
- Node.js 20+ (for building frontend assets)
- MySQL 5.7+/8.x (or SQLite for local development)

## Local Setup

```bash
git clone <your-repo-url> money-manager
cd money-manager

composer install
npm install

cp .env.example .env
php artisan key:generate
# edit .env — set APP_CURRENCY ($, €, £, ₦), APP_URL, and your DB_DATABASE/USERNAME/PASSWORD

php artisan migrate --seed
# demo account: demo@money.com / password

npm run dev
# in a second terminal: php artisan serve
```

## Production / Shared Hosting Deployment

The app is designed to run on cheap shared hosting (cPanel, Hostinger, Namecheap, etc.) — no Redis, no queue workers required (sessions, cache and queue all use the database).

### 1. Prepare locally

```bash
composer install --no-dev --optimize-autoloader
npm install && npm run build
```

`public/build` now contains the compiled React app.

### 2. Upload files

Upload the entire project to your hosting account so the web root points at the **`public/` folder** (this keeps `storage/`, `.env`, and database config out of the web root):

- Typical cPanel setup: place everything except `public/` at `~/app/`, then set the domain's document root to `~/app/public`, OR
- Upload into `~/domains/yourdomain.com/` and copy the *contents* of `public/` (index.php, .htaccess, build/, favicon) into `public_html/`, with the rest of the app one level up.

Make sure the host runs Apache with `mod_rewrite` enabled — `public/.htaccess` already handles routing.

### 3. Configure `.env`

Copy `.env.example` to `.env` and fill in:

- `APP_URL=https://yourdomain.com` — exact https URL (no trailing slash)
- `APP_DEBUG=false`, `APP_ENV=production`
- `APP_KEY=` — generate with `php artisan key:generate` (via SSH) or `php artisan key:generate --show` locally and paste it in
- `DB_*` — your MySQL database, user and password (create them in cPanel's MySQL Databases first)
- `MAIL_MAILER=smtp` with your SMTP host/port/username/password so password-reset emails are delivered
- `SESSION_SECURE_COOKIE=true`

### 4. Finalize on the server

```bash
php artisan migrate
php artisan config:clear && php artisan cache:clear
```

Then make sure these are writable by the web server (usually already the case via cPanel, else `chmod 775`):

- `storage/` (framework sessions, cache, views, logs)
- `bootstrap/cache/`

`php artisan storage:link` is only needed if you add file uploads later.

### 5. Set up the scheduler (reminders)

The `bills:check-due` command runs daily at 08:00 and creates due/overdue notifications. On shared hosting, add a **cron job** (cPanel → Cron Jobs):

```
* * * * * cd /home/USER/app && php artisan schedule:run >> /dev/null 2>&1
```

No separate queue worker is needed — jobs run synchronously.

### 6. HTTPS

Use the host's free SSL (cPanel → AutoSSL / SSL/TLS). Keep `APP_URL` and `SESSION_SECURE_COOKIE` set for the https URL. Avoid forcing HTTPS in `.htaccess` if the host terminates SSL at a proxy (redirect loops); the host usually handles the redirect.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `php artisan migrate --seed` | Create tables + demo data |
| `php artisan bills:check-due` | Generate due/overdue notifications (run via scheduler) |
| `php artisan schedule:list` | Show scheduled tasks |
| `npm run dev` / `npm run build` | Compile frontend assets |

## Tech Notes

- Currency is stored per user (`users.currency`) and defaults to `config('currency.default')`, set via `APP_CURRENCY`.
- Frontend routes are Inertia pages under `resources/js/Pages/`; shared layout `AppLayout.jsx`; design tokens in `resources/css/app.css`.
- The landing page (`/`) redirects authenticated users to the dashboard.
