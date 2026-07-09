# Success room seeding

Use `scripts/seed-success-room.mjs` through the npm script:

```sh
npm run seed:success-room -- <command> [options]
```

The script reads `.env.local` first, then lets shell environment variables override those values.

## Required environment

```sh
PUBLIC_CONVEX_URL=...
SUCCESS_ROOM_SEED_SECRET=...
SUCCESS_ROOM_PASSWORD=...
```

`SUCCESS_ROOM_PASSWORD` is only required for `seed-room`.

## Seed a room

`seed-room` replaces any existing room with the same slug. New rooms start with only the deck and audio sections.

```sh
SUCCESS_ROOM_PASSWORD=... npm run seed:success-room -- seed-room \
  --slug navacord \
  --deck static/success-room/navacord/deck.pdf \
  --audio static/success-room/navacord/audio.mp3
```

For a non-Navacord room, include `--prospect-name`:

```sh
SUCCESS_ROOM_PASSWORD=... npm run seed:success-room -- seed-room \
  --slug example-client \
  --prospect-name "Example Client" \
  --deck path/to/deck.pdf \
  --audio path/to/audio.mp3
```

## Add optional sections

`enable-sections` preserves the existing room. It is safe to rerun for the initial email format; rerunning the mutual success plan rewrites its seeded catalog from the manifest. Add one or both optional sections after seeding.

Add the mutual success plan:

```sh
npm run seed:success-room -- enable-sections \
  --slug navacord \
  --mutual-success-plan
```

Add the initial email format:

```sh
npm run seed:success-room -- enable-sections \
  --slug navacord \
  --initial-format
```

Add both:

```sh
npm run seed:success-room -- enable-sections \
  --slug navacord \
  --mutual-success-plan \
  --initial-format
```

The mutual success plan currently uses the Navacord seed manifest in `seed-success-room.mjs`. Add a manifest before enabling that section for another slug.
