# Meal Manager Frontend

Next.js frontend for hostel monthly meal calculation, configured for parallel frontend and backend development.

## Installed Libraries

- `axios`
- `@reduxjs/toolkit`
- `react-redux`
- `socket.io-client`

## Environment Setup

Create a `.env.local` file from `.env.example`.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Run Project

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Folder Structure

- `app/layout.js`: Root layout with Redux provider
- `app/page.js`: Starter dashboard + auth state view
- `lib/axiosClient.js`: Shared axios instance with interceptors
- `lib/socketClient.js`: Reusable socket.io client helper
- `services/authApi.js`: Auth API functions (`login`, `register`, `me`, `logout`)
- `store/index.js`: Redux store configuration
- `store/slices/authSlice.js`: Auth slice with async thunks

## Next Steps

- Add feature slices (`mealSlice`, `memberSlice`, `billingSlice`)
- Add API service files by module under `lib` or `services`
- Add auth flow and token refresh strategy
- Connect real-time events through `socketClient`
