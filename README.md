# smart-tab-manager

This project is a browser extension called Smart Tab Manager. It helps users manage their browser tabs efficiently by providing a user-friendly popup interface.

## Project Structure

```
smart-tab-manager
├── src
│   ├── background.ts       # Background script managing events and tasks
│   ├── popup.ts            # Logic for the popup interface
│   └── styles
│       └── main.css        # Main styles for the popup
├── public
│   ├── manifest.json       # Extension metadata and permissions
│   └── popup.html          # HTML structure for the popup
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd smart-tab-manager
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To load the extension in your browser, follow these steps:

1. Open your browser's extension management page.
2. Enable "Developer mode".
3. Click on "Load unpacked" and select the `public` directory of the project.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.