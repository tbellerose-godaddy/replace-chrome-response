const http = require('http');
const fs = require('fs');
const url = require('url');
const WebSocket = require('ws');
const chromeLauncher = require('chrome-launcher');
const chromeRemote = require('chrome-remote-interface');
const atob = require('atob');
const btoa = require('btoa');
const constants = require('../constants');
const {
  CONFIGURATION_FILE,
  HTTP_SERVER_PORT,
  WEB_SOCKET_SERVER_PORT,
  INITIAL_GUI_WIDTH,
  INITIAL_GUI_HEIGHT,
  INITIAL_GUI_POSITION_LEFT,
  INITIAL_GUI_POSITION_TOP,
  WEB_SOCKET_MESSAGE_TYPE_CONFIG,
  WEB_SOCKET_MESSAGE_TYPE_RELOAD,
  WEB_SOCKET_MESSAGE_TYPE_NAVIGATE
} = constants;
const hostname = '127.0.0.1';

class GUI {
  static launch(rootDir, reloadCallback, navigateCallback) {
    GUI.startHttpServer(rootDir);
    GUI.startWebSocketServer(rootDir, reloadCallback, navigateCallback);
    GUI.launchChrome();
  }

  static startHttpServer(rootDir) {
    const server = http.createServer((req, res) => {
      const pathname = url.parse(req.url, true).pathname;

      res.setHeader('Content-Type', pathname.endsWith('.js') ? 'application/javascript' : 'text/html');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Request-Method', '*');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.statusCode = 200;

      fs.readFile(rootDir + pathname, function (err, data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    });

    server.listen(HTTP_SERVER_PORT, hostname, () => {
      console.log(`http server running at http://${hostname}:${HTTP_SERVER_PORT}/`);
    });
  }

  static startWebSocketServer(rootDir, configChangeCallback, reloadCallback, navigateCallback) {
    const server = new WebSocket.Server({ port: WEB_SOCKET_SERVER_PORT });

    server.on('connection', ws => {
      console.log(`web-socket server running at http://${hostname}:${WEB_SOCKET_SERVER_PORT}/`);
      ws.on('message', message => {
        const messageData = JSON.parse(message);
        switch (messageData.type) {
          case WEB_SOCKET_MESSAGE_TYPE_CONFIG:
            configChangeCallback(messageData.config);
            fs.writeFileSync(`${rootDir}/${CONFIGURATION_FILE}`, JSON.stringify(messageData.config, null, 2));
            break;
          case WEB_SOCKET_MESSAGE_TYPE_RELOAD:
            reloadCallback();
            break;
          case WEB_SOCKET_MESSAGE_TYPE_NAVIGATE:
            navigateCallback(messageData.url);
            break;
          default:
            console.error('Invalid message type specified.');
        }
      });

      const configJson = fs.readFileSync(`${rootDir}/${CONFIGURATION_FILE}`, 'utf-8');

      try {
        const config = JSON.parse(configJson);
        ws.send(JSON.stringify(config));
      } catch (error) {
        console.error(error);
      }
    });
  }

  static async launchChrome() {
    const chrome = await chromeLauncher.launch({
      chromeFlags: [
        `--window-size=${INITIAL_GUI_WIDTH},${INITIAL_GUI_HEIGHT}`,
        `--window-position=${INITIAL_GUI_POSITION_LEFT},${INITIAL_GUI_POSITION_TOP}`,
        `--app=http://${hostname}:${HTTP_SERVER_PORT}/gui/index.html`
      ]
    });

    await chromeRemote({ port: chrome.port });
  }
}

module.exports = GUI;
