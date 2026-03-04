# CBE Education Platform - Frontend

This is the frontend application for the CBE Education Platform, built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites

- Node.js >= 18.18.0
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

The frontend uses environment variables for configuration. Create a `.env` file in the `Frontend` directory by copying the example:

```bash
cp .env.example .env
```

#### Available Environment Variables

- `VITE_AI_API_ENDPOINT`: The URL for the AI Assistant backend API
  - **Local Development**: `http://localhost:3001/api/ai-chat`
  - **Production**: Set this to your deployed backend URL (e.g., `https://your-backend.railway.app/api/ai-chat`)

- `VITE_WEB3FORMS_KEY`: Access key for Web3Forms contact form service
  - Get your free access key at [https://web3forms.com](https://web3forms.com)
  - **Required** for the contact form to work

**Example `.env` file:**

```env
# For local development
VITE_AI_API_ENDPOINT=http://localhost:3001/api/ai-chat

# Web3Forms contact form access key
VITE_WEB3FORMS_KEY=your-web3forms-access-key-here
```

**For production deployment on Vercel:**

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `VITE_AI_API_ENDPOINT` with your production backend URL (e.g., `https://your-backend.railway.app/api/ai-chat`)
   - `VITE_WEB3FORMS_KEY` with your Web3Forms access key

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Build

Build for production:

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
Frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ai-assistant/ # AI Assistant chat component
│   │   └── ui/           # shadcn/ui components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── assets/           # Static assets (images, videos, etc.)
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── public/               # Public static files
├── .env.example          # Environment variables template
├── vite.config.ts        # Vite configuration
└── package.json          # Project dependencies
```

## Key Features

- **AI Assistant**: Chat with an AI assistant for CBE-related questions (requires backend)
- **Contact Form**: Web3Forms-powered contact form for inquiries (requires access key)
- **Curriculum Explorer**: Browse and explore CBE curriculum
- **Progress Tracking**: Track student competency progress
- **Assessments**: Create and manage assessments
- **Evidence Upload**: Upload evidence of competency mastery

## Contact Form Configuration

The contact form uses [Web3Forms](https://web3forms.com) to handle form submissions without requiring a backend.

### Setup Instructions

1. **Get a Web3Forms Access Key** (free):
   - Visit [https://web3forms.com](https://web3forms.com)
   - Sign up and create a new form
   - Copy your access key

2. **Add to Environment Variables**:
   - Add `VITE_WEB3FORMS_KEY` to your `.env` file (local development)
   - Add it to Vercel environment variables (production)

3. **Verify Configuration**:
   - The contact form will show an error if the key is missing
   - Check browser console for debug messages about the environment variable

### Troubleshooting Contact Form

If you see the error "Form ID/Access key must be a string. Please check for extra spaces":

1. **Check Environment Variable is Set**:
   - Verify `VITE_WEB3FORMS_KEY` is in your `.env` file
   - Ensure there are no extra spaces around the key value

2. **For Local Development**:
   - Create `.env` file from `.env.example`: `cp .env.example .env`
   - Add your Web3Forms access key
   - Restart the dev server: `npm run dev`

3. **For Production (Vercel)**:
   - Go to Vercel project settings → Environment Variables
   - Add `VITE_WEB3FORMS_KEY` with your access key
   - Redeploy the application

## AI Assistant Configuration

The AI Assistant requires a backend server to be running. See the [Backend README](../Backend/README.md) for setup instructions.

### Troubleshooting AI Assistant

If you see the error "I apologize, but I'm currently unable to connect to the AI service":

1. **Check Backend is Running**:
   - Ensure the backend server is running on the configured port (default: 3001)
   - Test the backend health endpoint: `curl http://localhost:3001/health`

2. **Verify Environment Variable**:
   - Check that `VITE_AI_API_ENDPOINT` in your `.env` file points to the correct backend URL
   - For local development: `http://localhost:3001/api/ai-chat`

3. **Check Backend Configuration**:
   - Ensure the backend has a valid `GROQ_API_KEY` set in its `.env` file
   - See [Backend README](../Backend/README.md) for backend setup

4. **Rebuild Frontend** (if you changed `.env` for production build):
   - Stop the dev server
   - During development (`npm run dev`), environment variables are read at runtime, so just restart the server
   - For production builds (`npm run build`), environment variables are embedded at build time, so you need to rebuild
   - Environment variable changes will be picked up automatically in dev mode after restarting

## Deployment

### Vercel (Recommended)

The project is pre-configured for Vercel deployment with `vercel.json` in the root directory.

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Add environment variables in Vercel project settings:
   - `VITE_AI_API_ENDPOINT`: Your production backend URL

See [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Re-usable component library
- **React Router**: Client-side routing
- **Lucide React**: Icon library

## Security

### Environment Variables

- **Never commit `.env` files** to version control (they are already in `.gitignore`)
- The `.env` file contains sensitive configuration and should be kept private
- Use `.env.example` as a template for local setup
- For production, use Vercel's environment variables dashboard (variables are stored securely)

### API Keys

- Never hardcode API keys in source code
- Backend API keys (like `GROQ_API_KEY`) should only be stored on the backend server
- Frontend should only store public configuration like API endpoints

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

See the root [LICENSE](../LICENSE) file for details.
