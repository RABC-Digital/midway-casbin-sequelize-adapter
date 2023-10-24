import { MidwayAppInfo } from '@midwayjs/core';
import { join } from 'path';
import { CasbinRule, createAdapter } from '../../../../../src';

export default (appInfo: MidwayAppInfo) => {
  return {
    keys: '123456',
    sequelize: {
      dataSource: {
        'node-casbin-official': {
          dialect: 'sqlite',
          sync: true,
          storage: join(__dirname, '../../casbin.sqlite'),
          entities: [CasbinRule],
        }
      }
    },
    casbin: {
      modelPath: join(appInfo.appDir, 'basic_model.conf'),
      policyAdapter: createAdapter({
        dataSourceName: 'node-casbin-official'
      }),
      usernameFromContext: (ctx) => {
        return ctx.user;
      }
    }
  };
}
