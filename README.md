# PokeMap 🗺️👾

A high-performance, real-time social mapping and community web application designed for Pokémon Ultra Moon/Sun trainers. **PokeMap** merges dynamic geographic visualization with community-driven data, allowing trainers to track Pokémon encounters across the tropical Alola region, collaborate in real-time, and discuss sightings on an interactive, state-synced platform.

---

## 🌟 Key Features

*   **Custom Interactive Map (Alola Region)**: Seamlessly explore Melemele Island, Akala Island, Ula'ula Island, Poni Island, and Aether Paradise via an optimized custom Leaflet graphic overlay.
*   **Encounter Search & Dynamic Plotting**: Instantly query and visualize spawn locations, spawn rates, times of day (day/night cycles), and acquisition methods (SOS slots, surfing, fishing) fetched dynamically.
*   **Auto-Sync & Map State Recovery**: Never lose track of your pins. Your tracked Pokémon list and map markers are automatically synchronized and persisted to the cloud with smart debounced updates.
*   **Real-time Collaboration**: Dynamic forum posts, likes, reactions, and threaded comments synced instantly using WebSockets.
*   **Real-time Notifications**: Direct push alerts for follows, comments, mentions, and rare Pokémon sightings.
*   **3D Interactive Models**: Immersive WebGL landing page featuring an interactive, auto-rotating 3D model of Snorlax built using Three.js and React Three Fiber.
*   **Rich Text Posting**: Draft beautiful, formatting-enabled posts utilizing integrated TinyMCE rich text editing.

---

## 🛠️ Technology Stack

### Frontend Architecture
*   **Library**: `React 19` & `Vite` (High-speed HMR)
*   **Styling**: `Tailwind CSS v4`, `Lucide React` (Vector Icons), `Animate.css` (Smooth Micro-interactions)
*   **Geospatial Visualization**: `Leaflet` & `React Leaflet`
*   **3D Rendering**: `Three.js` + `@react-three/fiber` + `@react-three/drei` (WebGL Canvas)
*   **Data Fetching & Cache Management**: `@tanstack/react-query`
*   **Sockets / Real-time**: `socket.io-client`
*   **UI Components**: `Radix UI` / `Shadcn UI` (CVA-managed, fully accessible primitives)

### Backend Architecture
*   **Runtime & Framework**: `Node.js` with `Express v5.1` (Next-gen routing and native promise handling)
*   **Database & ODM**: `MongoDB Atlas` with `Mongoose`
*   **Real-time Server**: `Socket.io` (Custom rooms, duplex events, status registry)
*   **Authentication & Security**: `JSON Web Tokens (JWT)`, `Bcrypt.js`, `Cookie Parser`, `Nodemailer` (secure SMTP)
*   **Media Pipeline**: `Multer` (in-memory multi-part uploading) & `Cloudinary SDK` (cloud-hosted media CDN)
*   **Utilities**: `speakingurl` (semantic URL slugs generation), `nodemon` (hot reloading)

---

## 🚀 Setup & Installation Guide

Follow these steps to run both the frontend and backend of PokeMap locally on your computer.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas account)
*   A Cloudinary account (for media storage)
*   An email address configured for SMTP (Gmail App Password, Mailtrap, etc.) for OTP delivery

---

### 1. Backend Setup

1.  **Navigate to the Server Directory**:
    ```bash
    cd src/server
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a file named `.env` in `src/server/` and fill in your credentials:
    ```env
    DATABASE="your_mongodb_connection_string"
    JWT_SECRET="your_custom_jwt_secret_key"
    
    # Nodemailer Configuration (For OTP & Password Resets)
    EMAIL_USER="your_configured_email@gmail.com"
    EMAIL_PASSWORD="your_email_smtp_app_password"
    
    # Cloudinary Configuration (For Profile Pictures & Comment Uploads)
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
    ```

4.  **Seed the Database**:
    Seed the database with ready-to-use mock users, map pins, posts, and likes:
    ```bash
    npm run seed:all
    ```

5.  **Run the Server**:
    Start the backend in development mode with nodemon hot-reload:
    ```bash
    npm run dev
    ```
    The backend server will run on **`http://localhost:10000`**.

---

### 2. Frontend Setup

1.  **Navigate to the Client Directory**:
    ```bash
    cd src/client
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a file named `.env` in `src/client/`:
    ```env
    VITE_API_URL="http://localhost:10000"
    VITE_TINY_MCE="your_tinymce_api_key"
    ```

4.  **Run the Frontend**:
    Start the Vite development server:
    ```bash
    npm run dev
    ```
    The application will launch on **`http://localhost:3800`**. Open your browser and navigate to this address.

---

## ⚡ Special Technical Features & Techniques

This project incorporates advanced full-stack architectures and game-data extraction techniques, making it stand out as a highly polished application:

### 1. Leaflet Cartography with Cartesian Projections (`L.CRS.Simple`)
Standard maps map coordinates on a spherical globe (using latitudes and longitudes under standard Mercator projections like EPSG:3857). For fictional game worlds (like Alola), geographic coordinates do not apply. 
*   **The Solution**: PokeMap uses **`L.CRS.Simple`** in Leaflet, where `1 unit = 1 pixel`.
*   We map a `1000x1000px` PNG map (`PokeMap.png`) into a strict Cartesian plane where `[0, 0]` represents the top-left and `[-1000, 1000]` the bottom-right.
*   The system translates in-game locations (e.g., "Route 1", "Verdant Cavern") into static coordinates, with absolute boundaries `maxBounds` preventing users from scrolling or zooming outside the Alola archipelago.
*   **Coordinate Jittering**: Multiple Pokémon spawning at the exact same location (e.g. Route 2) would stack and hide each other. PokeMap dynamically adds a randomized micro-jitter (`±10px`) so overlapping markers display beautifully as adjacent clusters.

### 2. Advanced Game Data Stream Parsing (`encounterParser.js`)
Instead of hardcoding thousands of encounter rows manually into a MongoDB collection, PokeMap runs an in-memory, high-performance regex parser:
*   It ingests raw, unofficial text dumps of **Pokémon Ultra Sun/Moon Encounter Tables** (`Pokemon Ultra Sun - Encounter Tables.txt`).
*   It scans file lines line-by-line, utilizing dynamic regular expressions to parse map names, capture methods (SOS, Surfing, Fishing, Walk), spawn probabilities, and distinct Day/Night tables.
*   It aggregates this on-the-fly and overlays the coordinates, caching the results globally to ensure zero parsing overhead on subsequent searches.

### 3. Bidirectional Real-time WebSockets (Socket.io)
Rather than draining network bandwidth with frequent HTTP polling, the social modules utilize deep WebSockets integration:
*   **Post Rooms**: When a user views a post, they are automatically subscribed to a Socket.io room (`post_${postId}`). Any comment created, edited, deleted, or liked by another trainer is immediately broadcasted to all users in that specific room, updating their UI state reactively.
*   **Dynamic User Channels**: Upon authenticating, the client registers a dedicated channel (`user_${userId}`). Real-time alerts (mentions, follows, system notifications) are pushed directly to this room, preserving strict network isolation between users.

### 4. Smart Debounced Map State Syncing
In interactive maps, dragging markers, pinning locations, or toggling Pokémon filters causes continuous, high-frequency state updates. Making an HTTP request on every map action quickly degrades database performance.
*   PokeMap implements a **1-second debounced state sync**.
*   All additions, moves, and deletions of custom markers are handled instantaneously on the local React state.
*   Once the user stops modifying their map state for a continuous 1000ms window, a single payload is transmitted to the server's `/api/map/state` endpoint to persist the markers securely.

### 5. WebGL 3D Canvas via React Three Fiber
To create a high-fidelity visual experience, the landing page includes a rotating 3D Snorlax model.
*   Using `@react-three/fiber` and `@react-three/drei`, WebGL is brought directly into the React component tree.
*   Utilizes a custom `GLTFLoader` to asynchronously load `.glb` binary assets.
*   Features non-blocking frame animation via `useFrame`, rotating the model smoothly around its local axis (completing a full 360° rotation every 10 seconds) utilizing the delta time factor to guarantee identical rotation speeds regardless of the client's screen refresh rate (60Hz vs 144Hz).
*   Enforces OrbitControls parameters (`enableZoom={false}`, `enablePan={false}`) to let users interact with the model without affecting the surrounding DOM layout.

### 6. Robust Moderation & High-Security Auth Abstraction
*   **Pending Verification Queue**: Rather than registering accounts directly and inviting spam, user sign-ups are pushed to a `pendingUser` schema equipped with a temporary MongoDB TTL (Time To Live) index that automatically deletes expired, unverified accounts.
*   **Attempt-Throttled Password Recovery**: Resetting passwords employs a security mechanism that logs OTP attempts and blocks verification if a user exceeds limit thresholds, preventing credential stuffing.
*   **Admin Moderation Engine**: Admins can soft-delete community posts and log warning reasons (`postModeration.model.js`) directly through their dashboard, maintaining an audit log of all moderated content.

---

## 👥 Contributors

Developed with dedication for the **Ultra Web Skills** course at HCMUS. Feel free to clone, explore, and catch 'em all! 🔴💨