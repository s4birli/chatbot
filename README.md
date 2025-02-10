# Job Heaven - AI-Powered Job Description Assistant

Job Heaven is a modern web application that helps hiring managers and recruiters create comprehensive, structured job descriptions using AI technology. Built with Next.js and powered by Claude AI, it provides an interactive chat interface to gather job requirements and generate professional job descriptions.

## Features

- 🤖 AI-powered job description generation
- 💬 Interactive chat interface
- 🎯 Structured information gathering
- 📝 Comprehensive output format
- 🎨 Modern, Google-like design
- 📱 Responsive layout
- 🔄 Real-time conversation
- 🔍 Search functionality (coming soon)

## Technologies Used

### Frontend
- **Next.js 14** - React framework for production
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Typed programming language
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client

### Backend
- **Next.js API Routes** - Backend API endpoints
- **Claude AI (Anthropic)** - AI language model for generating job descriptions
- **Node.js** - JavaScript runtime environment

### Development Tools
- **ESLint** - Code linting tool
- **Prettier** - Code formatting tool
- **Git** - Version control
- **npm/yarn** - Package management

### Key Features Implementation
- **Server-Side Rendering (SSR)** - For better performance and SEO
- **Environment Variables** - For secure configuration management
- **API Route Handlers** - For handling API requests
- **Real-time Chat Interface** - For interactive job description creation
- **Responsive Design** - For cross-device compatibility

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/job-heaven.git
cd job-heaven
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
SYSTEM_PROMPT="Your custom system prompt here"
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Claude AI API key from Anthropic
- `SYSTEM_PROMPT`: The system prompt that guides the AI in creating job descriptions

## Usage

1. Click the "Start Hiring" button to begin a new conversation
2. Answer the AI's questions about the job position
3. The AI will gather information about:
   - Job Title
   - Purpose of the Role
   - Responsibilities
   - Required Skills
   - Qualifications
4. Review and receive your structured job description

## Project Structure

```
job-heaven/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # API endpoints
│   │   ├── page.tsx            # Main application page
│   │   └── layout.tsx          # Root layout
├── public/                      # Static files
├── .env                        # Environment variables
└── package.json                # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Claude AI](https://www.anthropic.com/claude)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
