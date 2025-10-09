# YelpCamp 🏕️

A full-stack web application for discovering and reviewing campgrounds. Users can create accounts, add campgrounds with images and locations, leave reviews, and explore campgrounds on an interactive cluster map.

![YelpCamp](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

## 🌟 Features

- **User Authentication & Authorization**

  - Secure user registration and login with Passport.js
  - Password hashing and session management
  - Authorization controls (only campground authors can edit/delete their posts)

- **Campground Management**

  - Create, read, update, and delete campgrounds (CRUD operations)
  - Upload multiple images via Cloudinary integration
  - Automatic geocoding of campground locations using MapTiler API
  - Image thumbnails for optimized loading

- **Interactive Maps**

  - Cluster map showing all campgrounds with dynamic clustering
  - Individual campground location maps
  - Click-to-zoom functionality on clusters
  - Popup markers with campground information

- **Review System**

  - Star rating system (1-5 stars)
  - Written reviews for each campground
  - Users can only delete their own reviews
  - Visual star display using custom CSS

- **Responsive Design**

  - Mobile-friendly interface with Bootstrap 5
  - Image carousels for campground photos
  - Flash messages for user feedback

- **Data Validation**
  - Client-side form validation
  - Server-side validation with Joi schemas
  - Error handling middleware

## 🛠️ Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js v5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend

- **EJS** - Templating engine
- **Bootstrap 5** - CSS framework
- **MapTiler SDK** - Interactive maps
- **Starability CSS** - Star rating display

### Authentication & Security

- **Passport.js** - Authentication middleware
- **passport-local-mongoose** - Simplified password hashing
- **express-session** - Session management
- **connect-flash** - Flash messages

### File Upload & Storage

- **Cloudinary** - Cloud-based image storage
- **Multer** - Multipart form data handling

### Validation & Utilities

- **Joi** - Schema validation
- **method-override** - HTTP verb support (PUT, DELETE)
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or MongoDB Atlas account)
- **Cloudinary Account** (for image uploads)
- **MapTiler API Key** (for maps)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/yelpcamp.git
cd yelpcamp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPTILER_API_KEY=your_maptiler_api_key
```

**Getting API Keys:**

- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com/) and get your credentials from the dashboard
- **MapTiler**: Sign up at [maptiler.com](https://www.maptiler.com/) and create an API key

### 4. Set up MongoDB

Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017`

Or update the connection string in `app.js` to use MongoDB Atlas:

```javascript
mongoose.connect("your_mongodb_atlas_connection_string");
```

### 5. Seed the database (optional)

Populate the database with sample campgrounds:

```bash
node seeds/index.js
```

### 6. Start the application

```bash
node app.js
```

The application will be running at `http://localhost:3000`

## 📁 Project Structure

```
YelpCamp/
├── cloudinary/          # Cloudinary configuration
├── controllers/         # Route controllers (MVC pattern)
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── models/             # Mongoose schemas
│   ├── campground.js
│   ├── review.js
│   └── user.js
├── public/             # Static assets
│   ├── javascripts/
│   │   ├── clusterMap.js
│   │   ├── showPageMap.js
│   │   └── validateForms.js
│   └── stylesheets/
│       └── stars.css
├── routes/             # Express routes
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── seeds/              # Database seeding
│   ├── cities.js
│   ├── index.js
│   └── seedHelpers.js
├── utils/              # Utility functions
│   ├── catchAsync.js
│   └── ExpressError.js
├── views/              # EJS templates
│   ├── campgrounds/
│   ├── users/
│   ├── partials/
│   └── layout/
├── .env                # Environment variables (not in repo)
├── .env.example        # Example environment variables
├── app.js              # Main application file
├── middleware.js       # Custom middleware
├── schemas.js          # Joi validation schemas
└── package.json        # Dependencies
```

## 🎯 Usage

### Creating an Account

1. Navigate to the Register page
2. Choose a username and password
3. Log in with your credentials

### Adding a Campground

1. Click "Create New Campground"
2. Fill in the campground details:
   - Title
   - Location (will be geocoded automatically)
   - Price per night
   - Description
   - Upload images
3. Submit the form

### Leaving a Review

1. Navigate to a campground's detail page
2. Select a star rating (1-5 stars)
3. Write your review
4. Submit

### Editing/Deleting

- You can only edit or delete campgrounds and reviews that you created
- Click the "Edit" or "Delete" buttons on your own content

## 🗺️ Key Features Explained

### Geocoding

When you create or edit a campground, the location is automatically geocoded using the MapTiler Geocoding API. This converts location names (like "Yosemite National Park") into geographic coordinates for map display.

### Image Upload

Images are uploaded to Cloudinary, which provides:

- Cloud storage
- Automatic image optimization
- Thumbnail generation
- Fast CDN delivery

### Cluster Map

The index page displays all campgrounds on an interactive map with clustering:

- Zoom in to see individual campgrounds
- Click clusters to zoom into that area
- Click individual markers to see campground details

### Authorization

The app uses middleware to ensure:

- Only logged-in users can create campgrounds and reviews
- Only the author can edit/delete their campgrounds
- Only the review author can delete their reviews

## 🔒 Security Features

- Password hashing with bcrypt (via passport-local-mongoose)
- HTTP-only cookies for session management
- Input sanitization and validation
- CSRF protection considerations
- Secure session configuration

## 🐛 Known Issues & Future Improvements

### Potential Improvements

- [ ] Add campground search functionality
- [ ] Implement pagination for campgrounds list
- [ ] Add user profiles with their campgrounds and reviews
- [ ] Implement "favorite" campgrounds feature
- [ ] Add email verification for registration
- [ ] Implement password reset functionality
- [ ] Add more detailed campground filters (price range, amenities)
- [ ] Implement real-time notifications
- [ ] Add social sharing features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of "The Web Developer Bootcamp 2025" course and is intended for educational purposes.

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- This project was built as part of [The Web Developer Bootcamp 2025](https://www.udemy.com/course/the-web-developer-bootcamp/) by Colt Steele
- MapTiler for the mapping API
- Cloudinary for image hosting
- Bootstrap for the UI framework

## 📸 Screenshots

_Add screenshots of your application here_

### Home Page

![Home Page](screenshots/home.png)

### Campgrounds Index with Cluster Map

![Index Page](screenshots/index.png)

### Campground Detail Page

![Detail Page](screenshots/show.png)

### Create New Campground

![New Campground](screenshots/new.png)

---

**Note**: Remember to never commit your `.env` file to version control. Always use `.env.example` as a template.
