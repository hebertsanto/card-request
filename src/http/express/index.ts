import express, { Express, Request, Response } from 'express';
import { v1Router } from '../../routes';
import { zodErrorMiddleware } from '../middlewares/zod-error';
import { logsMiddleware } from '../middlewares/logs';
import { logger } from '../../helpers/logger';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { HttpStatus } from '../../helpers/http/status-code';

export class AppRoutes {
  private expressApp: Express;

  constructor() {
    this.expressApp = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.expressApp.use(zodErrorMiddleware);
    this.expressApp.use(logsMiddleware);

    this.expressApp.use(compression());
    this.expressApp.use(helmet());
    this.expressApp.use(cors());
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes() {
    this.expressApp.use(v1Router);

    this.expressApp.get('/health', (_req: Request, res: Response) => {
      return res.status(HttpStatus.Ok).json({
        message: 'Server up',
        date: new Date().toISOString(),
      });
    });
  }
  public start(port: number) {
    this.expressApp.listen(port, () => {
      logger.info('Sever is running !');
    });
  }
}
