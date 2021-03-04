
const constants = {
  CONFIGURATION_FILE: 'config.json',
  HTTP_SERVER_PORT: 9090,
  WEB_SOCKET_SERVER_PORT: 9999,
  INITIAL_BROWSER_WIDTH: 1200,
  INITIAL_BROWSER_HEIGHT: 1000,
  INITIAL_BROWSER_POSITION_LEFT: 0,
  INITIAL_BROWSER_POSITION_TOP: 0,
  INITIAL_GUI_WIDTH: 1200,
  INITIAL_GUI_HEIGHT: 500,
  INITIAL_GUI_POSITION_LEFT: 100,
  INITIAL_GUI_POSITION_TOP: 100,
  WEB_SOCKET_MESSAGE_TYPE_CONFIG: 'config',
  WEB_SOCKET_MESSAGE_TYPE_RELOAD: 'reload',
  WEB_SOCKET_MESSAGE_TYPE_NAVIGATE: 'navigate'
};

if (typeof module === 'object' && module && typeof module.exports === 'object') {
  module.exports = constants;
} else {
  window.constants = constants;
}
