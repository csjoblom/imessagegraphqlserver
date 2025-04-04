# iMessage GraphQL Server

A GraphQL server for interacting with the macOS iMessage database.

## Features

- Access your iMessage conversations via GraphQL
- Query all chats and messages
- Send new messages via the GraphQL API
- Terminal UI for monitoring server status

## Requirements

- macOS (requires access to the Messages app database)
- [Bun](https://bun.sh/) runtime
- AppleScript access (used for sending messages via the Messages app)
- Full Disk Access for Terminal or your chosen IDE (for accessing the Messages database)
- Automation permissions for Terminal or your chosen IDE to control Messages

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/imessagegraphqlserver.git
cd imessagegraphqlserver
```

Install dependencies:

```bash
bun install
```

## Usage

Start the server:

```bash
bun start
```

The GraphQL server will be available at http://localhost:4000.

## GraphQL API

### Queries

- `getChats`: Get a list of all conversations
- `getChatCounts`: Get message counts for each conversation
- `getMessages(chatId: String, page: String)`: Get messages from a conversation with optional pagination
- `sendMessage(chatId: String, message: String)`: Send a message to a conversation

### Example Query

```graphql
query {
  getChats {
    name
    friendlyName
  }
}
```

```graphql
query {
  getMessages(chatId: "+11234567890") {
    chatter
    text
    date
  }
}
```

## Development

### Running Tests

```bash
bun test
```

For watch mode:

```bash
bun test:watch
```

To generate coverage report:

```bash
bun test:report
```

### Building

```bash
bun run build
```

## License

ISC

## Notes

This application accesses your iMessage database file and should be used responsibly. It requires macOS and will not work on other operating systems.

## What is this?
This repo provides a simple GraphQL API to Apple iMessages when running on a relatively recent Macintosh. As of writing, it has been tested on macOS 12 Monterey. It is intended to be used as a counterpart to other pieces of software such as [Messages For Macintosh](https://github.com/CamHenlin/MessagesForMacintosh)

## How do I run it?
You have two options: running from package or source. Most users will want to run from package, but if you intend to make changes or do debugging, you will likely want to choose from source.

## Required Permissions
You will need to provide Terminal.app additional permissions in your macOS "Security & Privacy" preferences to run this software due to its interoperability with the Messages and Address Book databases, and access of Messages script functionality. Two items are required and you will be prompted to enable these the first time you run the software:

- Under "Full Disk Access", "Terminal" must be selected
- Under "Automation", "Terminal" must have "Messages" enabled underneath it

Additionally, if you are running from package, you will almost certainly be told that you can't run software from unidentified developers. You'll need to go to the "Security & Privacy" general tab and click "Open Anyways" after the first time you try opening the package.

### Running from package
To run from package, try the following:

- Download from [this link](https://github.com/CamHenlin/imessagegraphqlserver/raw/main/dist/imessagegraphqlserver.zip)
- Unzip the downloaded file
- A Terminal window should pop up and ask for the permissions from the "Required Permissions" section above

Now skip to the section titled "What do I do once I'm up and running?" below

### Running from source
To run source, try the following. In a new terminal window:

```
git clone git@github.com:CamHenlin/imessagegraphqlserver.git
cd imessagegraphqlserver
npm install
node index
```

Next, a Terminal window should pop up and ask for the permissions from the "Required Permissions" section above

#### Building package from source
To build the package from source `pkg` is used. `pkg` is configured in the `pkg` section of this project's `package.json`. Simple run the following command to generate a new binary in the `/dist` directory:

```
pkg .
```

## What do I do once I'm up and running?
Once you're running, your Mac is ready to provide iMessage services to other products, such as [Messages For Macintosh](https://github.com/CamHenlin/MessagesForMacintosh). Here's an explanation of the UI and how it might help you:

![terminal screen grab](https://henlin.net/images/mfmserverscreengrab.png)

Sections
- `IP Address` - this tells you where your Server is expecting connections at. This is displayed so that you can enter it in to other software, such as [Messages For Macintosh](https://github.com/CamHenlin/MessagesForMacintosh). The IP Address is by far the most important thing being displayed and will likely need to be input into other software.
- `Chat Handle` - this should match the current iMessage account that you will be chatting from
- `Help` - displays some helpful messages on how to exit the Server
- `Logs` - displays what the Server is currently doing -- helpful for debugging or confirming that the Server is up
- `Stats` - some simple progress bars to show that the Server is doing stuff and to take up a bit of space on the screen. Fun to watch.
