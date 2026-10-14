# QuizWiz

A multiplayer quiz prototype with a React interface, Firebase account handling, and a Socket.IO server.

## What is included

- Registration and login screens backed by Firebase Authentication and Firestore.
- Admin and player views for creating and joining quiz rooms.
- Socket.IO handlers for rooms, starting a game, and submitting answers.
- A small set of Python quiz questions and example scoring logic.

## Status

Prototype with incomplete client/server integration. Rooms and scores are held in server memory and disappear on restart. The server’s separate demo login routes are not connected to the Firebase authentication used by the active frontend.

## Local setup

You need Node.js and npm, plus a Firebase project with email/password authentication and Firestore. No Node.js version is pinned.

```bash
git clone https://github.com/wtfashwin/Quiz-App.git
cd Quiz-App
npm ci
```

Configure your own Firebase project in `src/firebase.js` and provide Firestore rules appropriate to your local test setup. No Firestore rules file or Firebase setup script is included.

Start the server in one terminal:

```bash
cd server
npm ci
npm start
```

Start the frontend from the repository root in another terminal:

```bash
npm start
```

The frontend uses `http://localhost:3000`; the Socket.IO client targets `http://localhost:3001`. Changing the server’s `PORT` also requires changing the client URL and allowed origin as appropriate.

For local exploration, register an account and inspect the admin/player screens. The client currently assigns the admin role using a fixed email comparison in `src/contexts/AuthContext.js`; this is demo behavior, not a secure role-management system.

## Source guide

- `src/App.js` — active routes and protected views.
- `src/contexts/AuthContext.js` and `src/firebase.js` — Firebase account handling.
- `src/components/admin/` and `src/components/quiz/` — active room and quiz views.
- `src/socket.js` — local Socket.IO connection.
- `server/server.js` — room state, demo auth routes, and socket handlers.

## Available checks

The frontend defines `npm run build` and `npm test`. The current `src/App.test.js` still asserts the Create React App “learn react” template text. The server’s `npm test` is an explicit placeholder that exits with an error.

## Known gaps

The active client requests `get_rooms` and `get_room`, but the server has no handlers for them. Question progression and game completion are not implemented on the server. Answer submission adds a fixed score without checking correctness, and the client/server score payloads differ. Firebase identity is not verified by the Socket.IO server. These gaps need resolving before a full multiplayer game can be relied on.

## License

`server/package.json` declares ISC. No repository-wide license file is included.
