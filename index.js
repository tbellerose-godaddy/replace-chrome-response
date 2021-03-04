const fs = require('fs');
const fetch = require('fetch-base64');
const chromeLauncher = require('chrome-launcher');
const chromeRemote = require('chrome-remote-interface');
const atob = require('atob');
const btoa = require('btoa');
const gui = require('./gui/gui');
const constants = require('./constants');
const {
  CONFIGURATION_FILE,
  INITIAL_BROWSER_WIDTH,
  INITIAL_BROWSER_HEIGHT,
  INITIAL_BROWSER_POSITION_LEFT,
  INITIAL_BROWSER_POSITION_TOP
} = constants;

class ModifyChromeRepsonse {
  constructor() {
    this.config = null;
    this.browser = null;
    this.reloadCallback = this.reloadCallback.bind(this);
    this.navigateCallback = this.navigateCallback.bind(this);

    if (process.argv.includes('--gui')) {
      setTimeout(() => gui.launch(__dirname, this.reloadCallback, this.navigateCallback), 1000);
    }
  }

  async fetchResource(uri) {
    const data = await fetch.auto(uri);
    return data.length ? data[0] : '';
  }

  reloadCallback() {
    this.browser && this.browser.reload({ ignoreCache: true });
  }

  navigateCallback(url) {
    this.browser && this.browser.navigate({ url });
  }

  async main(config) {
    this.config = config;
    const { startingUrl } = this.config;

    const chrome = await chromeLauncher.launch({
      chromeFlags: [
        `--window-size=${INITIAL_BROWSER_WIDTH},${INITIAL_BROWSER_HEIGHT}`,
        `--window-position=${INITIAL_BROWSER_POSITION_LEFT},${INITIAL_BROWSER_POSITION_TOP}`,
      ],
      startingUrl
    });

    const client = await chromeRemote({ port: chrome.port });

    const { Page, Runtime, Network } = client;

    this.browser = Page;

    await Promise.all([Runtime.enable(), Network.enable()]);

    await Network.setRequestInterception({ patterns: [{ urlPattern: '*.js*', resourceType: 'Script', interceptionStage: 'HeadersReceived' }] });

    Network.requestIntercepted(async ({ interceptionId, request }) => {
      let response, body;
      const { rules } = this.config;

      const rule = rules.find(rule => rule.enabled && rule.match === request.url);
      if (rule) {
        console.log(`replacing '${rule.match}' with '${rule.replace}'`);
        body = await this.fetchResource(rule.replace);
        response = { body: body, base64Encoded: true };
      } else {
        response = await Network.getResponseBodyForInterception({ interceptionId });
      }

      const bodyData = response.base64Encoded ? atob(response.body) : response.body;
      const newHeaders = [
        'Date: ' + (new Date()).toUTCString(),
        'Connection: closed',
        'Content-Length: ' + bodyData.length,
        'Content-Type: text/javascript'
      ];

      Network.continueInterceptedRequest({
        interceptionId,
        rawResponse: btoa('HTTP/1.1 200 OK' + '\r\n' + newHeaders.join('\r\n') + '\r\n\r\n' + bodyData)
      });
    });
  }
}

const configJson = fs.readFileSync(`${__dirname}/${CONFIGURATION_FILE}`, 'utf-8');

try {
  const config = JSON.parse(configJson);
  const modifyChromeRepsonse = new ModifyChromeRepsonse();
  modifyChromeRepsonse.main(config);
} catch (error) {
  console.error(error);
}
