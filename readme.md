# AWS Nuke Tool

The AWS Nuke Tool is a desktop application built with Electron that allows users to clean up AWS resources efficiently. This tool provides a terminal interface where users can interact with AWS services, specify credentials, and run cleanup scripts.

## Features

- Cross-platform support: Windows, macOS, and Linux
- Interactive terminal interface
- AWS credential management
- Resource cleanup using `aws-nuke`

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/vasubhalodi07/aws-nuke-tool.git
cd aws-nuke-tool
```

### 2. Install Dependencies

```sh
npm install
```

## Running the Application

### Development Mode

To run the application in development mode:

```sh
npm start
```

### Build for Distribution

To package the application for distribution, run the following command:

```sh
npm run dist
```

This will create distributable packages in the `dist` directory for the operating system you are building on.

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue to discuss what you would like to change.

## Acknowledgements

This project uses the following open-source packages:

- [Electron](https://www.electronjs.org/)
- [xterm.js](https://xtermjs.org/)
- [node-pty](https://github.com/microsoft/node-pty)
- [aws-nuke](https://github.com/rebuy-de/aws-nuke)

## Troubleshooting

### Common Issues

1. **Dependencies not installed correctly**:
   - Ensure that you have the correct version of Node.js and npm installed.
   - Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

2. **AppImage not running**:
   - Make sure the AppImage is executable.
   - Run the AppImage from the terminal to see if there are any error messages.

### Getting Help

If you encounter any issues, please open an issue on GitHub or contact the repository maintainer.