import '@testing-library/jest-dom'

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

if (typeof global.ReadableStream === 'undefined') {
  try {
    global.ReadableStream = globalThis.ReadableStream || require('node:stream/web').ReadableStream;
  } catch (e) {}
}

if (typeof global.MessagePort === 'undefined') {
  const { MessagePort, MessageChannel } = require('worker_threads');
  global.MessagePort = MessagePort;
  global.MessageChannel = MessageChannel;
}

const { Request, Response, Headers, fetch } = require('undici');
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.fetch = fetch;




