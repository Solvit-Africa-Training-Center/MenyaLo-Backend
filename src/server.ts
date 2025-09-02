import { createServer } from './app';
import { Database } from './database';
import { errorLogger, logStartup } from './utils/logger';

const server = createServer();
const port = parseInt(process.env.PORT || '5001');

Database.database
  .authenticate()
  .then(async () => {
    try {
      server.listen(port, '0.0.0.0', () => {
        logStartup(port, process.env.NODE_ENV || 'DEV');
      });
    } catch (error) {
      errorLogger(error as Error, 'Server Startup');
    }
  })
  .catch((error) => {
    errorLogger(error as Error, 'Database Connection');
  });
