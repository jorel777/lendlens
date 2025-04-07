# LendLens

A web application for local lenders to manage lent items and track defaulters.

## Features

- Admin dashboard for managing defaulters
- Public view of active defaulters with countdown timers
- Image upload and storage
- Real-time updates
- Responsive design

## Firebase Setup

This project uses Firebase for authentication, database, and storage. Follow these steps to set up Firebase:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password sign-in method
3. Create a Firestore database
4. Enable Storage for image uploads
5. Create a web app in your Firebase project
6. Copy the Firebase configuration from the web app settings
7. Replace the placeholder values in `src/firebase.js` with your actual Firebase configuration

```javascript
// Example Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

8. Create an admin user in Firebase Authentication
9. Set up Firestore security rules to restrict access

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The project is configured for GitHub Pages deployment. To deploy:

```bash
# Deploy to GitHub Pages
./deploy.sh
```

## Firebase Security Rules

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /defaulters/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /defaulters/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## License

MIT 