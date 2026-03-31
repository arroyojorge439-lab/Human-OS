# Dream Interpretation AI

This is a web application that uses the Google Gemini API to interpret the meaning of dreams. The user can input a dream description, and the AI will provide a detailed interpretation based on common dream symbols and psychological theories.

## Features

- **Dream Input:** A simple and intuitive interface for users to write down their dreams.
- **AI-Powered Interpretation:** Leverages the power of the Google Gemini API to provide insightful and detailed dream interpretations.
- **Modern UI:** A clean and modern user interface built with React and Tailwind CSS.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Express.js, Node.js
- **AI:** Google Gemini API
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- A Google Gemini API key

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add your Google Gemini API key:

    ```
    GEMINI_API_KEY=<your-api-key>
    ```

### Running the Application

-   **Development mode:**

    ```bash
    npm run dev
    ```

    This will start the development server with hot-reloading.

-   **Production mode:**

    ```bash
    npm run build
    npm run start
    ```

    This will build the application for production and start the production server.
