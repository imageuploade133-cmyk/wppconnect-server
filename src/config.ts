import { ServerOptions } from './types/ServerOptions';

export default {
  // Server Security
  secretKey: process.env.SECRET_KEY || 'THISISMYSECURETOKEN',

  // Server Configuration
  host: process.env.HOST || 'http://localhost',
  port: process.env.PORT || '21465',

  // Branding
  deviceName: process.env.DEVICE_NAME || 'WppConnect',
  poweredBy: process.env.POWERED_BY || 'WPPConnect-Server',

  // Sessions
  startAllSession: process.env.START_ALL_SESSION === 'true',
  tokenStoreType: process.env.TOKEN_STORE_TYPE || 'file',

  maxListeners: Number(process.env.MAX_LISTENERS || 15),

  customUserDataDir:
    process.env.CUSTOM_USER_DATA_DIR || './userDataDir/',

  // Webhook
  webhook: {
    url: process.env.WEBHOOK_URL || null,
    autoDownload: process.env.WEBHOOK_AUTO_DOWNLOAD !== 'false',
    uploadS3: process.env.WEBHOOK_UPLOAD_S3 === 'true',
    readMessage: process.env.WEBHOOK_READ_MESSAGE !== 'false',
    allUnreadOnStart:
      process.env.WEBHOOK_ALL_UNREAD_ON_START === 'true',
    listenAcks: process.env.WEBHOOK_LISTEN_ACKS !== 'false',
    onPresenceChanged:
      process.env.WEBHOOK_ON_PRESENCE_CHANGED !== 'false',
    onParticipantsChanged:
      process.env.WEBHOOK_ON_PARTICIPANTS_CHANGED !== 'false',
    onReactionMessage:
      process.env.WEBHOOK_ON_REACTION_MESSAGE !== 'false',
    onPollResponse:
      process.env.WEBHOOK_ON_POLL_RESPONSE !== 'false',
    onRevokedMessage:
      process.env.WEBHOOK_ON_REVOKED_MESSAGE !== 'false',
    onLabelUpdated:
      process.env.WEBHOOK_ON_LABEL_UPDATED !== 'false',
    onSelfMessage:
      process.env.WEBHOOK_ON_SELF_MESSAGE === 'true',
    ignore: ['status@broadcast'],
  },

  websocket: {
    autoDownload: process.env.WS_AUTO_DOWNLOAD === 'true',
    uploadS3: process.env.WS_UPLOAD_S3 === 'true',
  },

  chatwoot: {
    sendQrCode: process.env.CHATWOOT_SEND_QR !== 'false',
    sendStatus: process.env.CHATWOOT_SEND_STATUS !== 'false',
  },

  archive: {
    enable: process.env.ARCHIVE_ENABLE === 'true',
    waitTime: Number(process.env.ARCHIVE_WAIT_TIME || 10),
    daysToArchive: Number(process.env.ARCHIVE_DAYS || 45),
  },

  log: {
    level: process.env.LOG_LEVEL || 'info',
    logger: ['console', 'file'],
  },

  createOptions: {
  executablePath:
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_BIN ||
    '/usr/bin/chromium',

  headless: true,

  browserArgs: [
    '--disable-web-security',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-sync',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-cache',
    '--disable-application-cache',
    '--disk-cache-size=0',
    '--disable-offline-load-stale-cache',
    '--aggressive-cache-discard',
    '--mute-audio',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-features=site-per-process',
    '--disable-software-rasterizer',
    '--ignore-certificate-errors',
    '--ignore-ssl-errors',
    '--ignore-certificate-errors-spki-list',
  ],

  linkPreviewApiServers: null,
},

  mapper: {
    enable: process.env.MAPPER_ENABLE === 'true',
    prefix: process.env.MAPPER_PREFIX || 'tagone-',
  },

  db: {
    mongodbDatabase:
      process.env.MONGODB_DATABASE || 'tokens',

    mongodbCollection:
      process.env.MONGODB_COLLECTION || '',

    mongodbUser:
      process.env.MONGODB_USER || '',

    mongodbPassword:
      process.env.MONGODB_PASSWORD || '',

    mongodbHost:
      process.env.MONGODB_HOST || '',

    mongoIsRemote:
      process.env.MONGO_IS_REMOTE === 'true',

    mongoURLRemote:
      process.env.MONGO_REMOTE_URL || '',

    mongodbPort: Number(
      process.env.MONGODB_PORT || 27017
    ),

    redisHost:
      process.env.REDIS_HOST || 'localhost',

    redisPort: Number(
      process.env.REDIS_PORT || 6379
    ),

    redisPassword:
      process.env.REDIS_PASSWORD || '',

    redisDb: Number(
      process.env.REDIS_DB || 0
    ),

    redisPrefix:
      process.env.REDIS_PREFIX || 'docker',
  },

  aws_s3: {
    region: process.env.AWS_REGION || ('sa-east-1' as any),
    access_key_id: process.env.AWS_ACCESS_KEY_ID || null,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY || null,
    defaultBucketName: process.env.AWS_BUCKET || null,
    endpoint: process.env.AWS_ENDPOINT || null,
    forcePathStyle:
      process.env.AWS_FORCE_PATH_STYLE === 'true',
  },
} as unknown as ServerOptions;
