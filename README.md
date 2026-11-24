# Airbnb Clone

Airbnb Clone is a full-stack, Airbnb-inspired rental marketplace built with React, Express, MongoDB, Mongoose, and JWT authentication.

## Features

- Destination search, filtering, sorting, and availability-aware results
- Homepage stay carousels grouped by destination, with six stays per city and expanded Gurugram and Dehradun rows
- Listing details, image galleries, amenities, maps fallback, and reviews
- JWT registration/login, protected routes, roles, and password hashing
- Demo checkout options for card, wallet, and UPI
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

To add the extra sixth stay for each destination without deleting existing data, run:

```bash
npm run seed --prefix server -- --add-destination-stays
```

Development accounts:

- Demo traveler: Andrew Wilson — `demo@staynest.com` / `Demo123!`
- Demo host: `host@staynest.com` / `Host123!`
- Demo admin: `admin@staynest.com` / `Admin123!`

These are development-only credentials. Use strong, unique credentials and secrets in production.

## Demo Checkout

The card, wallet, and UPI options are simulations for demonstration only. No payment provider is contacted, no payment details are collected, and no money is charged or refunded. Do not use demo bookings to accept real reservations or payments.

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
- Goa stays: [Basilica of Bom Jesus](https://commons.wikimedia.org/wiki/File:Basilica_of_Bom_Jesus_and_vehicles_parked_infront.jpg), iMahesh, CC BY-SA 4.0; [Fort Aguada](https://commons.wikimedia.org/wiki/File:Aguada_Fort_Top_View,_North_Goa.jpg), Rupeshsarkar, CC BY-SA 4.0; [Dudhsagar Falls](https://commons.wikimedia.org/wiki/File:Dudhsagar_Falls,_Goa_%2851821730751%29.jpg), solarisgirl, CC BY-SA 2.0.
- Mumbai stays: [Marine Drive](https://commons.wikimedia.org/wiki/File:Marine_Drive_Mumbai.jpg), Gannu03, CC BY-SA 4.0; [Chhatrapati Shivaji Terminus](https://commons.wikimedia.org/wiki/File:Chhatrapati_Shivaji_Terminus_%28Victoria_Terminus%29.jpg), Joe Ravi, CC BY-SA 3.0; [Elephanta Caves](https://commons.wikimedia.org/wiki/File:A_pillar_in_Cave_1,_Elephanta_Great_Cave_Mumbai.jpg), Elroy Serrao, CC BY-SA 2.0.
- Manali stays: [Hidimba Devi Temple](https://commons.wikimedia.org/wiki/File:Hidimba_Devi_Temple,_Dhungri_Manali.jpg), Ganesh Mohan T, CC BY-SA 4.0; [Solang Valley](https://commons.wikimedia.org/wiki/File:A_view_of_solang_valley_on_the_way_to_rohtang_pass.jpg), Shubhanshu, public domain; [Rohtang Pass](https://commons.wikimedia.org/wiki/File:Manali_to_Rohtang_Pass_01.jpg), RAJENDRAN TM, CC BY-SA 4.0.
- Bengaluru stays: [Lalbagh Botanical Garden](https://commons.wikimedia.org/wiki/File:Lalbagh_%28Lal_Baugh%29_Botanical_Garden_in_Bangalore_%28now_Bengaluru%29_1.jpg), CreativoCamaal, CC BY-SA 4.0; [Vidhana Soudha](https://commons.wikimedia.org/wiki/File:Gate_3_%28East%29,_Vidhana_Soudha_%2801%29.jpg), Moheen Reeyad, CC BY-SA 4.0; [Cubbon Park](https://commons.wikimedia.org/wiki/File:Band-Stand-Cubbon-Park-Bengaluru-karnataka-India.jpg), N. Vivekananthamoorthy, CC BY 4.0.
- Delhi stays: [Red Fort](https://commons.wikimedia.org/wiki/File:20191203_Moti_Masjid,_Red_Fort,_Delhi_0502_6354_DxO.jpg), Jakub Hałun, CC BY-SA 4.0; [Qutb Minar](https://commons.wikimedia.org/wiki/File:Qutb_Minar_2011.jpg), Sfu, CC BY-SA 4.0; [Humayun's Tomb](https://commons.wikimedia.org/wiki/File:A_unique_frame_of_Humayun_Tomb,_Delhi.jpg), Thesolorover, CC BY-SA 4.0.
- Bali stays: [Uluwatu Temple](https://commons.wikimedia.org/wiki/File:Kuta_Bali_Indonesia_Pura-Luhur-Uluwatu-03.jpg), CEphoto, Uwe Aranas, CC BY-SA 3.0; [Tanah Lot](https://commons.wikimedia.org/wiki/File:Pura_Tanah_Lot,_Bali,_Indonesia,_20220827_1007_1147.jpg), Jakub Hałun, CC BY-SA 4.0; [Bali rice terraces](https://commons.wikimedia.org/wiki/File:Rice_terraces,_Bali.jpg), Vyacheslav Argenberg, CC BY 4.0.
- Dubai stays: [Palm Jumeirah](https://commons.wikimedia.org/wiki/File:Artificial_Archipelagos,_Dubai,_United_Arab_Emirates_ISS022-E-024940_lrg.jpg), Expedition 22 crew, public domain; [Museum of the Future](https://commons.wikimedia.org/wiki/File:Museum_of_the_Future_Audi_Etron-Dubai_UAE-Andres_Larin.jpg), Saaremees, CC BY-SA 4.0; [Dubai Marina](https://commons.wikimedia.org/wiki/File:Dubai_Marina_04.jpg), Davide Mauro, CC BY-SA 4.0.
- Paris stays: [Louvre Cour Napoléon](https://commons.wikimedia.org/wiki/File:Cour_Napol%C3%A9on_%28Flickr,_Stavros_A%29.jpg), Stavros Argiropoulos, CC BY-SA 2.0; [Notre-Dame Cathedral](https://commons.wikimedia.org/wiki/File:Cath%C3%A9drale_Notre_Dame,_Paris_30_September_2015.jpg), Antonin Subtil, CC BY-SA 4.0; [Arc de Triomphe](https://commons.wikimedia.org/wiki/File:Arc_Triomphe.jpg), Benh LIEU SONG, CC BY-SA 3.0; [Sacré-Cœur](https://commons.wikimedia.org/wiki/File:Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre_-_Paris_-_GT-01_-_2024.jpg), Terragio67, CC BY-SA 4.0.
- London stays: [Big Ben](https://commons.wikimedia.org/wiki/File:Big_Ben_Elizabeth_Tower_London_2023_01.jpg), Julian Herzog, CC BY 4.0; [Buckingham Palace](https://commons.wikimedia.org/wiki/File:Buckingham_Palace,_London_-_April_2009.jpg), Diliff, CC BY-SA 3.0; [London Eye](https://commons.wikimedia.org/wiki/File:London_Eye_Twilight_April_2006.jpg), Diliff, CC BY 2.5; [St Paul's Cathedral](https://commons.wikimedia.org/wiki/File:Cath%C3%A9drale_St-Paul_-_coupole.jpg), Bernard Gagnon, CC BY-SA 3.0.
- Jaipur Jantar Mantar stay photo: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:20191218_Jantar_Mantar,_Jaipur_0906_8983_DxO.jpg), Jakub Hałun, CC BY-SA 4.0.
- Sixth destination stays: [Lotus Temple](https://commons.wikimedia.org/wiki/File:Lotus_Temple_in_New_Delhi_03-2016.jpg), A.Savin, FAL; [Nahargarh Fort](https://commons.wikimedia.org/wiki/File:20191218_Fort_Nahargarh,_Jaipur_1514_9294.jpg), Jakub Hałun, CC BY-SA 4.0; [Chapora Fort](https://commons.wikimedia.org/wiki/File:Fort_Chapora_26012016.jpg), Nikhil B/Wikimedia Commons, CC BY 3.0; [Gateway of India](https://commons.wikimedia.org/wiki/File:Panoramic_view_of_Taj_Palace_Hotel_and_Taj_Tower_with_the_iconic_Gateway_of_India_in_the_background.jpg), iMahesh, CC BY-SA 4.0; [Beas River at Nehru Kund](https://commons.wikimedia.org/wiki/File:Beas_River_at_Nehru_Kund,_Manali_(2).jpg), In Transit, CC BY 4.0; [Nandi Hills](https://commons.wikimedia.org/wiki/File:Nandi_Hills,_Bengaluru.jpg), Sidhant Soni, CC BY-SA 4.0; [Ulun Danu Beratan Temple](https://commons.wikimedia.org/wiki/File:Pura_Ulun_Danu_Beratan_in_bali.jpg), Abizar Al Ghifari, CC BY-SA 4.0; [Burj Khalifa](https://commons.wikimedia.org/wiki/File:Burj_dubai_3.11.08.jpg), Aheilner, CC BY-SA 3.0; [Tower Bridge](https://commons.wikimedia.org/wiki/File:Tower_Bridge_London_Dusk_Feb_2006.jpg), Diliff, CC BY-SA 3.0; [Eiffel Tower](https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons.jpg), Benh LIEU SONG, public domain.
- Other destination photos are served from Unsplash.

## Deployment

This repository includes a Render Blueprint in `render.yaml` and a Vercel SPA rewrite in `client/vercel.json`.

1. Create a MongoDB Atlas database and a database user. Keep the connection string private.
2. Deploy the repository to Render using the Blueprint. Set the prompted `MONGODB_URI`, a strong random `JWT_SECRET`, and `CLIENT_URL` after Vercel creates the frontend URL.
3. If the Atlas database is empty, seed it once from your machine with `MONGODB_URI` set in `server/.env` using `npm run seed --prefix server`. The normal seed command deletes existing records, so never run it against a database containing data you need. The seed includes public development accounts, including an admin and hosts; change or remove their passwords before making the site public.
4. Create a Vercel project from this repository with `client` as the Root Directory. Set `VITE_API_URL` to `https://<your-render-service>.onrender.com/api` and deploy.
5. Set the exact Vercel site origin as Render's `CLIENT_URL`, then redeploy the API.
Demo checkout options do not charge money. Render's free service may sleep when idle and take a little time to wake up.

## Future Improvements

- Provider SDK for interactive maps
- Automated email notifications
- Real payment integration
- Advanced review moderation and analytics
