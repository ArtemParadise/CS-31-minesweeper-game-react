# CS-31 Minesweeper Game - React

A React-based implementation of the classic Minesweeper game built with Vite for fast development and hot module replacement.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 22.0 or higher)
- npm (comes with Node.js)

## Project Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Project

### Development Mode

To start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Application entry point
├── index.css        # Global styles
└── assets/          # Static assets (images, icons, etc.)
```

## Development

- The project uses Vite for fast development with hot module replacement
- ESLint is configured for code quality and consistency
- React 19 with modern hooks and functional components
- CSS for styling (can be extended with CSS modules or styled-components)

## Contributing

1. Make your changes
2. Run `npm run lint` to check for any linting issues
3. Test your changes in development mode
4. Submit a pull request

## License

This project is for educational purposes as part of CS-31 coursework.
