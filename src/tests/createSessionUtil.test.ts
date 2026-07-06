import * as wppconnect from '@wppconnect-team/wppconnect';

import CreateSessionUtil from '../util/createSessionUtil';
import { clientsArray, eventEmitter } from '../util/sessionUtil';

// Mock everything that could cause circular issues or side effects
jest.mock('@wppconnect-team/wppconnect', () => ({
  create: jest.fn(),
  SocketState: { CONFLICT: 'CONFLICT' },
  StatusFind: {
    autocloseCalled: 'autocloseCalled',
    disconnectedMobile: 'disconnectedMobile',
    isLogged: 'isLogged',
    inChat: 'inChat',
    qrReadSuccess: 'qrReadSuccess',
  },
  defaultLogger: { info: jest.fn(), error: jest.fn() },
}));

jest.mock('../controller/sessionController', () => ({
  download: jest.fn(),
}));

jest.mock('../util/functions', () => ({
  autoDownload: jest.fn(),
  callWebHook: jest.fn(),
  startHelper: jest.fn(),
}));

jest.mock('../util/tokenStore/factory', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createTokenStory: jest.fn().mockReturnValue({
        getToken: jest.fn().mockResolvedValue({}),
        setToken: jest.fn().mockResolvedValue({}),
      }),
    };
  });
});

jest.mock(
  '..',
  () => ({
    logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
  }),
  { virtual: true }
);

describe('CreateSessionUtil', () => {
  let sessionUtil: CreateSessionUtil;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionUtil = new CreateSessionUtil();
    mockReq = {
      body: {},
      serverOptions: {
        secretKey: 'test-secret',
        createOptions: {
          browserArgs: ['--no-proxy-server'],
          puppeteerOptions: {},
        },
        webhook: {
          onParticipantsChanged: false,
          onReactionMessage: false,
          onRevokedMessage: false,
          onPollResponse: false,
          onLabelUpdated: false,
          listenAcks: false,
          onPresenceChanged: false,
        },
        log: { logger: ['console'] },
      },
      logger: {
        info: jest.fn(),
        error: jest.fn(),
      },
      io: {
        emit: jest.fn(),
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      _headerSent: false,
    };
    Object.keys(clientsArray).forEach((key) => delete clientsArray[key]);
  });

  const mockWppClient = {
    session: 'test-session',
    isConnected: jest.fn().mockResolvedValue(true),
    onStateChange: jest.fn(),
    onMessage: jest.fn(),
    onAnyMessage: jest.fn(),
    onIncomingCall: jest.fn(),
    onParticipantsChanged: jest.fn(),
    onReactionMessage: jest.fn(),
    onRevokedMessage: jest.fn(),
    onPollResponse: jest.fn(),
    onUpdateLabel: jest.fn(),
    onAck: jest.fn(),
    onPresenceChanged: jest.fn(),
    useHere: jest.fn(),
  };

  it('should create a session without proxy by default', async () => {
    (wppconnect.create as jest.Mock).mockResolvedValue(mockWppClient);

    await sessionUtil.createSessionUtil(mockReq, clientsArray, 'test-session');

    expect(wppconnect.create).toHaveBeenCalledWith(
      expect.objectContaining({
        browserArgs: expect.arrayContaining(['--no-proxy-server']),
      })
    );
  });

  it('should use proxy when provided in request body', async () => {
    mockReq.body.proxy = {
      url: 'http://proxy.com:8080',
      username: 'user',
      password: 'pass',
    };

    (wppconnect.create as jest.Mock).mockResolvedValue(mockWppClient);

    await sessionUtil.createSessionUtil(mockReq, clientsArray, 'test-session');

    expect(wppconnect.create).toHaveBeenCalledWith(
      expect.objectContaining({
        proxy: {
          url: 'http://proxy.com:8080',
          username: 'user',
          password: 'pass',
        },
      })
    );
  });

  it('should wait for QR code when res is provided in opendata', async () => {
    (wppconnect.create as jest.Mock).mockImplementation(() => {
      return new Promise(() => {
        setTimeout(() => {
          eventEmitter.emit(
            'qrcode-test-session',
            'data:image/png;base64,mock-qr',
            'mock-url',
            { session: 'test-session' }
          );
        }, 10);
        // Don't resolve immediately with mockWppClient as it would trigger 'CONNECTED' event in start()
        // In real app, create() takes time.
      });
    });

    const opendataPromise = sessionUtil.opendata(
      mockReq,
      'test-session',
      mockRes
    );

    await new Promise((resolve) => {
      mockRes.json.mockImplementation(() => {
        resolve(null);
        return mockRes;
      });
      opendataPromise;
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'qrcode',
        qrcode: 'mock-qr',
      })
    );
  });

  it('should wait for CONNECTED status when res is provided in opendata', async () => {
    (wppconnect.create as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          eventEmitter.emit('status-test-session', mockWppClient, 'CONNECTED');
        }, 10);
        resolve(mockWppClient);
      });
    });

    const opendataPromise = sessionUtil.opendata(
      mockReq,
      'test-session',
      mockRes
    );

    await new Promise((resolve) => {
      mockRes.json.mockImplementation(() => {
        resolve(null);
        return mockRes;
      });
      opendataPromise;
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'CONNECTED',
      })
    );
  });
});
