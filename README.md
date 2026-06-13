<img width="1164" height="556" alt="logo-with-no-bg" src="https://github.com/user-attachments/assets/1cae24a8-8d3b-4526-8479-21346265c0f1" />

# Relic Letters
A custom medieval fantasy themed letter app I wrote for a special someone

![License](https://img.shields.io/badge/license-Custom-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey)

> **Note:** This project was originally built as a heartfelt gift for a special someone. You are completely welcome to **fork, tweak, and re-skin** this codebase to create a magical experience for your own special someone! All I ask is that you maintain a visible link crediting this original repository.

## Key Features
* Move into your house - create your own address
* Write letters at your desk
* Keep a collection of previous letters
* Visit the post office to post a letter
* Choose all kind of postage options!
* Collect your post
* Recieve notificaions when someone has posted to you

## Upcoming Features + Roadmap
* Some mail gets lost - you may have to search the map to find it
* Hidden messages - some letters may have a cipher
*Notifications when letters arrive
*View all missed notificaions in app and manage them

## Gameplay Demonstrations

### Settling In & Movement

| Getting Around | Moving into your House   |
| :---: | :---: |
| ![Movement](docs/demo/movement.gif) |  ![Enter Home](docs/demo/enter-home.gif) | 

---

### Your Home

| Inside the Home | Writing a Letter | Viewing Your Mail |
| :---: | :---: | :---: |
| ![Inside Home](docs/demo/inside-home.gif) | ![Writing](docs/demo/writing.gif) | ![View Letter](docs/demo/view-letter.gif) |

---

### The local Post Office

| The Post Office | Posting Experience | Address System |
| :---: | :---: | :---: |
| ![Post Office](docs/demo/post-office.gif) | ![Post Options](docs/demo/post-options.gif) | ![Address book](docs/demo/address-book.gif) | |

## Tech Stack & Architecture

* **Frontend:** React (bundled with Vite)
* **Styling:** Custom CSS Layouts
* **Database & Auth:** Firebase (Firestore / Firebase Auth / Firebase Cloud Messaging)
* **Backend Server:** Node.js (Dedicated server for handling post operations and queues)

## Running your own version!

### Prerequisites
Before running this project, ensure you have the following installed on your machine:
* **Node.js** (v18.x or higher recommended)
* **npm** (comes bundled with Node)

### Environment Variables
This project requires several Firebase and backend configuration keys to function properly. Create a `.env` file in the root directory of the frontend project. A template file named `.env.example` is provided in the root directory:

### Installation & Running Locally

Follow these steps to get your local development environment up and running:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/relic-letters.git](https://github.com/yourusername/relic-letters.git)

2. **Navigate into the project directory:**
   ```bash
   cd relic-letters

3. **Install dependencies:**
   ```bash
   npm install
   

4. **Start the Vite development server:**
   ```bash
   npm run dev
   

Open your browser and navigate to the local address provided in your terminal (usually `http://localhost:5173`).

*(Note: Link to the Node.js backend repository and server-side setup instructions will be provided here once ready.)*

## AI Disclosure
The idea of the application is conceptualised and structurally designed entirely by me, this came from my heart. AI assistance was utilised specifically as a development partner to speed up development via the following:
* Reformat complex logic loops.
* Safely wire up advanced external APIs and modular libraries.
* Designing the frontend CSS layouts (because who *actually* enjoys debugging CSS flexbox?).

## Asset Credits

This project uses the following amazing asset packs to bring its world to life. Huge thanks to the creators!

| Asset Pack / Audio | Creator / Source |
| :--- | :--- |
| **Mystic Lands Adventure Asset Pack** | [Pixy Fantasy Studios](https://pixyfantasystudios.itch.io/mystic-lands-adventure-asset-pack) |
| **Pixel Art Interior Top-Down RPG Asset Pack** | [ZedPxl](https://zedpxl.itch.io/pixelart-interior-top-down-rpg-asset-pack) |
| **Pixel Art Village Top-Down RPG Asset Pack** | [ZedPxl](https://zedpxl.itch.io/pixelart-village-top-down-rpg-asset-pack) |
| **Pixel Art Top-Down Basic** | [Cainos](https://cainos.itch.io/pixel-art-top-down-basic) |
| **Opening Letter Sound Effect** | [Pixabay / Film Special Effects](https://pixabay.com/sound-effects/film-special-effects-opening-letter-69854/) |
| **Musical Main Theme Track** | [Pixabay / Musical Main Theme](https://pixabay.com/sound-effects/musical-main-theme-68815/) |
| **Cartoon Music & Game SFX** | [Cartoon Music Game SFX on Pixabay](https://pixabay.com/users/cartoon-music-game-sfx-54195863/) |
| **Freesound Community Audio** | [Freesound Community on Pixabay](https://pixabay.com/users/freesound_community-46691455/) |
| **Medieval Horizons Audio Collection** | [Medieval Horizons on Pixabay](https://pixabay.com/users/medieval_horizons-52313478/) |

---

### 📄 Licensing Note
All assets utilized in this project are used in accordance with their respective creators' licensing terms on itch.io. All rights, copyrights, and intellectual property belong to their original authors.

## Terms of Use & License
Please use this software exclusively for good! 

You are completely welcome to **fork, tweak, and re-skin** this codebase to create a magical experience for your own special someone. All I ask is that you please maintain a visible link crediting the original repository. 

Made with ❤️ and a lot of patience.


