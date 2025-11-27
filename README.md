<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://docs.fictionlab.pl/img/robots/raph/logotype_white.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://docs.fictionlab.pl/img/robots/raph/logotype_grey.svg">
  <img alt="Raph Rover Logo" src="https://docs.fictionlab.pl/img/robots/raph/logotype_white.svg" style="width: 400px">
</picture>

# Raph Rover Web User Interface

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF?style=flat&logo=vite&logoColor=white)
![ROS](https://img.shields.io/badge/ROS-roslibjs-22314E?style=flat&logo=ros&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## About

**Raph Rover UI** is a responsive web-based user interface for controlling and monitoring the **Raph Rover** robot. Built with **React** and **TypeScript**, it provides real-time communication with **ROS** (Robot Operating System) through rosbridge.

Key features include robot status monitoring, movement control via **keyboard**, **virtual gamepad**, or any Gamepad API compatible device like **Xbox** or **PlayStation** controllers, video streaming, parameter configuration, steering mode switching, and system service management.

> [!TIP]
> To learn more about Raph Rover itself visit our [Documentation](https://docs.fictionlab.pl/raph-rover)

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
- **Preview robot status**: Monitor battery levels, sensor data, and system health in real-time.
- **Movement control**: Control the robot using **keyboard**, **virtual gamepad** or any Gamepad API compatible device like **Xbox** or **PlayStation** controllers.
- **Dynamic parameter tuning**: Modify robot parameters on-the-fly.

## Contributing

Feel free to contribute to the Raph Rover UI project! Whether it's fixing bugs or adding new features, your contributions are welcome.

You can contribute to Raph Rover UI by:

- [submitting an issue](https://github.com/RaphRover/raph_ui/issues),
- [joining discussions](https://github.com/RaphRover/raph_ui/discussions),
- [submitting pull requests](https://github.com/RaphRover/raph_ui/pulls).

Before you open a pull request, please ensure your code adheres to the existing style and conventions used in the project. We use **ESLint** and **Prettier** for code formatting and linting. Before submitting your pull request, run the following commands to format your code:

```bash
npm run lint
npm run format
```

To check for any issues with the code, run:

```bash
npm run check
```

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute the code as per the terms of the license.

## Contact

For questions, suggestions, or support about Raph Rover UI or any Fictionlab products, feel free to contact us. You can reach us via our [official website](https://fictionlab.pl) or email us at [contact@fictionlab.pl](mailto:contact@fictionlab.pl).

[![website](https://img.shields.io/badge/Website-Fictionlab.pl-C57B2C?style=flat&logo=google-chrome&logoColor=white)](https://fictionlab.pl)
[![email](https://img.shields.io/badge/Email-contact@fictionlab.pl-C57B2C?style=flat&logo=gmail&logoColor=white)](mailto:contact@fictionlab.pl)

You can also join out Discord community to connect with other users and developers:

[![Discord](https://img.shields.io/discord/1394297639062868061?label=Join%20our%20Discord&logo=discord&style=flat)](https://discord.gg/57DdtCnhCc)

Check out social media channels for the latest updates and news about Raph Rover and Fictionlab:

[![Facebook](https://img.shields.io/badge/Facebook-Fictionlab-C57B2C?style=flat&logo=facebook&logoColor=white)](https://www.facebook.com/fictionlabpl)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fictionlab-C57B2C?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/10935694)
