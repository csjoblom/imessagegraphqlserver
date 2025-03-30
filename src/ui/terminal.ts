import blessed from 'blessed';

/**
 * UI component interfaces
 */
export interface UIComponents {
  screen: blessed.Widgets.Screen;
  ipBox: blessed.Widgets.BoxElement;
  chatHandleBox: blessed.Widgets.BoxElement;
  infoBox: blessed.Widgets.BoxElement;
  statusBox: blessed.Widgets.BoxElement;
}

/**
 * Creates the terminal UI components
 * 
 * @returns UI components
 */
export function createUI(): UIComponents {
  // Create the screen
  const screen = blessed.screen({
    smartCSR: true
  });
  
  screen.title = 'iMessage GraphQL Server';
  
  // Create the IP box
  const ipBox = blessed.box({
    top: '0%',
    left: '0%',
    width: '50%',
    height: '25%',
    tags: true,
    label: 'IP Address',
    border: {
      type: 'line'
    }
  });
  
  // Create the chat handle box
  const chatHandleBox = blessed.box({
    top: '25%',
    left: '0%',
    width: '50%',
    height: '25%',
    tags: true,
    label: 'Chat Handle',
    border: {
      type: 'line'
    }
  });
  
  // Create the info box
  const infoBox = blessed.box({
    top: '50%',
    left: '0%',
    width: '50%',
    height: '25%',
    tags: true,
    label: 'Help',
    border: {
      type: 'line'
    },
    content: 'Press {bold}escape{/bold}, {bold}q{/bold}, or {bold}Ctrl+c{/bold} to quit'
  });
  
  // Create the status box
  const statusBox = blessed.box({
    top: '75%',
    left: '0%',
    width: '100%',
    height: '25%',
    tags: true,
    label: 'Logs',
    border: {
      type: 'line'
    },
    alwaysScroll: true,
    scrollable: true,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'blue'
      },
      style: {
        bg: 'white'
      }
    },
    content: 'Starting, waiting for server to begin...'
  });
  
  // Create the stats box
  const statsBox = blessed.box({
    top: '0%',
    left: '50%',
    width: '50%',
    height: '75%',
    tags: true,
    label: 'Stats',
    border: {
      type: 'line'
    }
  });
  
  // Add all components to the screen
  screen.append(ipBox);
  screen.append(chatHandleBox);
  screen.append(infoBox);
  screen.append(statusBox);
  screen.append(statsBox);
  
  // Render the screen
  screen.render();
  
  return {
    screen,
    ipBox,
    chatHandleBox,
    infoBox,
    statusBox
  };
} 