import { App, Configuration, Init, Inject } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as casbin from '@midwayjs/casbin';
import * as sequelize from '@midwayjs/sequelize';
import { join } from 'path';
import { Enforcer } from 'casbin';
import { SequelizeAdapter } from '../../../../src';

@Configuration({
  imports: [koa, sequelize, casbin],
  importConfigs: [join(__dirname, 'config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  @Inject()
  sequelizeDataSourceManager: sequelize.SequelizeDataSourceManager;

  @Init()
  async init() {
    let e = new Enforcer();
    e['fs'] = require('fs');
    await e.initWithFile(
      join(__dirname, '../basic_model.conf'),
      join(__dirname, '../basic_policy.csv')
    );
    const adapter = new SequelizeAdapter(
      this.sequelizeDataSourceManager.getDataSource('node-casbin-official'),
      {}
    );
    await adapter.savePolicy(e.getModel());
  }

  async onReady() {
    // save from file
    this.app.useMiddleware(async (ctx, next) => {
      ctx.user = ctx.query.username;
      await next();
    });
  }
}
