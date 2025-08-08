# Lodgify Lite

This is a modern hotel reservation application built with Next.js and Firebase. It provides a platform for users to browse and book hotels, for hotel owners to manage their properties, and for administrators to oversee the platform.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **AI/Generative Features**: [Genkit](https://firebase.google.com/docs/genkit)
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore)
*   **Authentication**: Firebase Authentication (simulated with local logic)

## Key Features

*   **User Authentication**: Secure sign-up and login for guests, hotel owners, and admins.
*   **Hotel Listings**: Browse and search for hotels with beautiful image galleries.
*   **Dynamic Search**: Filter hotels by destination.
*   **Owner Dashboard**: Allows property owners to add and manage their hotels and rooms.
*   **Admin Dashboard**: A control panel for administrators to approve or reject new hotel and room submissions.
*   **AI-Powered Suggestions**: When a room booking fails, an AI agent suggests alternative accommodations.

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
