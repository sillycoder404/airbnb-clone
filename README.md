# Airbnb Clone

Airbnb Clone is a full-stack, Airbnb-inspired rental marketplace built with React, Express, MongoDB, Mongoose, and JWT authentication.

## Features

- Destination search, filtering, sorting, and availability-aware results
- Homepage stay carousels grouped by destination, including Gurugram and Dehradun demo listings
- Listing details, image galleries, amenities, maps fallback, and reviews
- JWT registration/login, protected routes, roles, and password hashing
- Real date-overlap validation and dynamic booking totals
- My Trips, saved wishlist listings, and host management
- Host dashboard, listing CRUD, reservations, and listing performance
- Responsive mobile, tablet, and desktop interface

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Lucide icons
- Backend: Node.js, Express, Mongoose
- Database: MongoDB or MongoDB Atlas
- Authentication: JWT and bcrypt

## Project Structure

```text
client/       React frontend
server/       Express API
server/models Mongoose models
server/routes REST route definitions
server/controllers API logic
server/seed/seed.js Development seed data
```

## Setup

```bash
npm install --prefix client
npm install --prefix server
npm install
```

Copy the environment examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and optionally `MAPS_API_KEY`.

Start MongoDB locally or create a MongoDB Atlas cluster. For a local MongoDB instance, use:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/staynest
```

## Run

Backend:

```bash
npm run dev --prefix server
```

Frontend:

```bash
npm run dev --prefix client
```

Open `http://localhost:5173`. The API runs on `http://localhost:5050`.

You can also run both from the root:

```bash
npm run dev
```

## Seed Demo Data

```bash
npm run seed --prefix server
```

Development accounts:

- Demo traveler: Andrew Wilson — `demo@staynest.com` / `Demo123!`
- Demo host: `host@staynest.com` / `Host123!`
- Demo admin: `admin@staynest.com` / `Admin123!`

These are development-only credentials. Use strong, unique credentials and secrets in production.

## API Overview

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Listings | `GET /api/listings`, `GET /api/listings/search`, `GET /api/listings/:id`, CRUD routes |
| Bookings | `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings/:id`, `DELETE /api/bookings/:id` |
| Host | `GET /api/host/listings`, `GET /api/host/bookings`, `GET /api/host/dashboard` |
| Reviews | `GET/POST /api/listings/:id/reviews` |
| Wishlist | `GET /api/wishlist`, `POST/DELETE /api/wishlist/:listingId` |
| Admin | `/api/admin/*` |

## Map Integration

The listing detail page uses a polished approximate-location fallback. To enable a real map, set `MAPS_API_KEY` and integrate a supported map provider in the listing detail map panel. The key must remain server-only or be exposed to a provider through the provider's explicitly public frontend key mechanism.

## Image Credits

- Hawa Mahal facade image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:East_facade_of_the_Hawa_Mahal,_Jaipur.jpg), CC0.
- Hawa Mahal gallery photo: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hawa_Mahal_2011.jpg), by Marcin Białek, CC BY-SA 4.0.
- Amber Fort gallery photo: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Jaipur_03-2016_02_Amber_Fort.jpg), by A.Savin, FAL.
- Jal Mahal gallery photo: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:20191218_Jal_Mahal_Palace_in_Jaipur_1429_9234.jpg), by Jakub Hałun, CC BY-SA 4.0.
- City Palace gallery photo: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Jaipur_03-2016_20_City_Palace_complex.jpg), by A.Savin, FAL.
- Jaipur destination card: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Jaipur_Jantar_Mantar_panorama_2011.jpg), by Marcin Białek and Aleks G, CC BY-SA 3.0.
- Bangalore Palace image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bangalore_Palace_-_Jayamahal.jpg), by Bikashrd, CC BY-SA 4.0.
- Other destination photos are served from Unsplash.

## Deployment

- Frontend: Vercel or Netlify; set `VITE_API_URL` to the deployed API URL.
- Backend: Render or another Node.js host; set all server environment variables.
- Database: MongoDB Atlas.
- Use `npm run build --prefix client` for the production frontend build.
- Keep `.env` files out of source control.

## Future Improvements

- Provider SDK for interactive maps
- Payment gateway integration
- Automated email notifications
- Image upload service
- Advanced review moderation and analytics
