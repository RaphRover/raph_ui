<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://docs.fictionlab.pl/img/robots/raph/logotype_dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://docs.fictionlab.pl/img/robots/raph/logotype_light.svg">
  <img alt="Raph Rover Logo" src="https://docs.fictionlab.pl/img/robots/raph/logotype_light.svg" width="300">
</picture>

# Raph Rover UI

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF?style=flat&logo=vite&logoColor=white)
![ROS](https://img.shields.io/badge/ROS-roslibjs-22314E?style=flat&logo=ros&logoColor=white)
![License](https://img.shields.io/badge/License-TBD-lightgrey?style=flat)

## About

**Raph Rover UI** is a modern, responsive web-based user interface for controlling and monitoring the **Raph Rover** robot. Built with **React** and **TypeScript**, it provides real-time communication with **ROS** (Robot Operating System) through rosbridge.

Key features include robot status monitoring, movement control via keyboard or virtual gamepad, video streaming, parameter configuration, steering mode switching, and system service management.

> [!TIP]
> To learn more about Raph Rover visit our [Documentation](https://docs.fictionlab.pl/raph-rover)

## How to Build

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js) or another package manager
- **Git** (for cloning the repository)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaphRover/raph_ui.git
   cd raph_ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```

   This will start the Vite development server, and you should be able to access the app in your web browser at `http://localhost:5173`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create an optimized build of the application in the `dist` directory.

You can test the production build locally using:

```bash
npm run serve
```

## Features

- **Real-time ROS communication**: Leverages rosbridge for seamless interaction with ROS topics and services.
- **Dynamic parameter tuning**: Modify robot parameters on-the-fly and observe the effects immediately.
- **Customizable dashboard**: Users can configure their dashboard to show the most relevant information and controls.
- **Multi-language support**: The interface can be easily translated into different languages.
- **Accessibility features**: Designed with accessibility in mind, including keyboard navigation and screen reader support.

## Contributing

We welcome contributions from developers of all skill levels. To contribute to Raph Rover UI, follow these steps:

1. **Fork the repository**: Click on the "Fork" button at the top right of this page.
2. **Create a new branch**: 
   ```bash
   git checkout -b my-feature-branch
   ```
3. **Make your changes**: Edit, add, and delete files as necessary.
4. **Commit your changes**: 
   ```bash
   git commit -m "Description of my changes"
   ```
5. **Push to your fork**: 
   ```bash
   git push origin my-feature-branch
   ```
6. **Create a pull request**: Go to the "Pull requests" tab in the main repository and click "New pull request".

Please ensure your code adheres to the existing style and conventions used in the project. We use ESLint and Prettier for code formatting and linting. Before submitting your pull request, run the following commands to format your code:

```bash
npm run lint
npm run format
```

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute the code as per the terms of the license.
