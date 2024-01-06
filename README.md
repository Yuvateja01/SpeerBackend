# Speer Backend - Note Taking Application (Node.js, Express, MongoDB)
Postman Collection of all the requests [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/8938113-51a4393a-0b83-4d1f-94ea-809d6e336526?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D8938113-51a4393a-0b83-4d1f-94ea-809d6e336526%26entityType%3Dcollection%26workspaceId%3D77ba5f77-21e5-40d9-8f4c-08754df90f7c)


Speer Backend is a note-taking backend built with Node.js using Express for handling server requests, MongoDB for data storage, JWT for authentication, and rate limiting using middleware. It also includes MongoDB text index search, testing using Mocha and Chai, and input validation via Zod.

## Features

- **Authentication:** Secure your API endpoints using JWT-based authentication.
- **Note Management:** Create, read, update, and delete notes with ease.
- **Rate Limiting:** Implement rate limiting using middleware to prevent abuse or DoS attacks.
- **Text Index Search:** Utilize MongoDB text indexes for efficient search operations.
- **Testing:** Includes comprehensive tests using Mocha and Chai.
- **Input Validation:** Utilizes Zod for validating input data.

## API Endpoints

- **POST /api/auth/signup:** Create a new user account.
- **POST /api/auth/login:** Log in to an existing user account and receive an access token.
- **GET /api/notes:** Get a list of all notes for the authenticated user.
- **GET /api/notes/:id:** Get a note by ID for the authenticated user.
- **POST /api/notes:** Create a new note for the authenticated user.
- **PUT /api/notes/:id:** Update an existing note by ID for the authenticated user.
- **DELETE /api/notes/:id:** Delete a note by ID for the authenticated user.
- **POST /api/notes/:id/share:** Share a note with another user for the authenticated user.
- **GET /api/notes/:id/share:** Shared notes can be accessed by all the users they are shared with.
- **GET /api/search?q=:query:** Search for notes based on keywords for the authenticated user.

## Getting Started
Add a .env file with SECRET_KEY(Jwt Secret Key),MONGO_URL(mongo db uri),PORT(port for the server to run)
To run the application via Docker, follow these steps:

1. **Build the Docker image:**
    ```bash
    docker build -t speerbackend .
    ```

2. **Run the Docker container:**
    ```bash
    docker run -d -p 3000:3000 speerbackend
    ```

This will start the Speer Backend server on [http://localhost:3000](http://localhost:3000).

## Running Locally

To run the application locally:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Yuvateja01/SpeerBackend.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd SpeerBackend
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Set up MongoDB:**
    Ensure MongoDB is installed and running on your system.

5. **Start the application:**
    ```bash
    npm start
    ```
    or
    ```bash
    node app.js
    ```

6. **Access the website:**
    Open your web browser and go to [http://localhost:3000](http://localhost:3000) to access the website.

## Prerequisites

- Node.js
- MongoDB

## Testing

To run tests using Mocha and Chai:

```bash
npm test
