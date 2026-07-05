import app from 'config/app';
import server from 'config/server';

import express, { Router } from 'express';

import departmentRouter from 'routes/department.routes';
import employeeRouter from 'routes/employee.routes';

import { logger, loggerHttp } from 'lib/logger';
import { buildPath } from 'utils/path.utils';
import useCors from 'lib/cors';
import cors from 'config/cors';
import Responser from '@responser';
import useErrorCatcher from 'lib/error-handler';
import { GlobalConfig } from 'types/express.types';

/**
 * @description Сделан синглтоном, чтобы избежать пересоздания, экземпляр должен быть только один
 */
export class Server {
  private static _instance: Server;

  constructor() {
    if (!Server._instance) Server._instance = this;

    return Server._instance;
  }

  private readonly config = {
    server,
    cors,
    app,
  };

  private readonly routers = {
    departments: departmentRouter,
    employee: employeeRouter,
  };

  private logger = logger;

  public loggerHttp = loggerHttp;

  public http = express();

  // all use's app middleware's
  private useLogger() {
    this.http.use(this.loggerHttp);
  }
  private useCors() {
    this.logger.info(`Cors whitelist: ${this.config.cors.whitelist.join(',')}`);
    this.logger.info(
      `Cors allowed headers: ${this.config.cors.allowedHeaders.join(',')}`,
    );

    this.http.use(useCors());

    return;
  }
  private useJson() {
    this.http.use(express.json());
  }

  private useResponser() {
    this.http.use(async (_, res, next) => {
      const responser = new Responser(res);

      for (const responserKey of responser.keys()) {
        const action = responser[responserKey];

        if (typeof action === 'function')
          Reflect.defineProperty(res, responserKey, {
            writable: true,
            enumerable: true,
            value: (action as Function).bind(responser),
          });
      }

      return next();
    });
  }

  private useGlobalPath(path: string) {
    return '/' + buildPath(this.config.server.apiPrefix, path);
  }
  private useRouter(router: Router, name: string) {
    const routerPath = this.useGlobalPath(name);

    this.logger.debug(`Init ${name} router, by path: ${routerPath}`);

    this.http.use(routerPath, router);

    this.logger.info(`Router by path: ${routerPath}, success work!`);

    return;
  }

  private useRoutes() {
    this.logger.info(
      `Global prefix for routes: ${this.config.server.apiPrefix}`,
    );

    this.useRouter(this.routers.departments, 'departments');
    this.useRouter(this.routers.employee, 'employees');
  }

  private useGlobalErrorHandler() {
    this.http.use(useErrorCatcher);
  }

  private applyGlobalConfig() {
    this.http.set(GlobalConfig.GlobalPrefix, this.config.server.apiPrefix);
  }

  private listen() {
    this.http.listen(this.config.server.port, err => {
      if (err) return this.logger.error(err);

      return this.logger.info(
        `Server successfully start at ${this.config.app.isDev ? `http://localhost:${this.config.server.port}` : `port:${this.config.server.port}`}`,
      );
    });
  }

  async bootstrap() {
    this.applyGlobalConfig();

    this.useLogger();
    this.useCors();
    this.useJson();

    this.useResponser();

    this.useRoutes();

    this.useGlobalErrorHandler();

    this.listen();
  }
}
