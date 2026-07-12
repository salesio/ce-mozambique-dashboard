# Christ Embassy Mozambique Dashboard

First dashboard prototype for the church team portal.

**Live demo:** https://salesio.github.io/ce-mozambique-dashboard/

Login with the demo credentials on the page (`admin@ce-mozambique.org` / `demo`).

### Supabase (database backend)

PostgreSQL, auth, and file storage run on **Supabase** — not on GitHub Pages.

See **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** for project creation, schema, RLS, storage, and env variables.

Quick start:

```bash
cp .env.example .env
# fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run build:supabase
```

Without env variables, the dashboard keeps using **localStorage mock data**.

### Publishing updates

GitHub Pages serves the static site from the `gh-pages` branch (legacy deploy). After changing files on `main`, update the live site:

```bash
git checkout gh-pages
git checkout main -- index.html css js manifest.webmanifest .nojekyll
git commit -am "Update live site"
git push origin gh-pages
git checkout main
```

## Included in v1 prototype

- Login screen placeholder
- Dashboard home
- Members
- Departments
- Cell groups
- Counseling / first timers
- Escola de Fundação tracking
- Users and roles

## Counseling workflow

The first timer form includes:

- Nome
- Número de telefone
- Data de nascimento
- Bairro
- Profissão
- Quem convidou
- Nasceu de novo?
- Quer fazer Escola de Fundação?
- Quer fazer parte de uma célula?
- Vai participar no próximo culto?
- Notas de acompanhamento

If a first timer chooses Escola de Fundação, they are automatically enrolled in the Foundation School tracker.

## Foundation School workflow

- 7 classes
- Exam score
- Graduation status

## Current technical note

This prototype stores data in browser localStorage only. The production version should connect to Supabase for authentication, database, roles and backups.
