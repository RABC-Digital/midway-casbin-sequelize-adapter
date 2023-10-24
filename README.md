# midwayjs casbin with sequelize

[![Package Quality](http://npm.packagequality.com/shield/midway-casbin-sequelize-adapter.svg)](http://packagequality.com/#?package=midway-casbin-sequelize-adapter)


## Document

需要依赖 `midway-casbin-sequelize-adapter` 包和 sequelize 组件。

```
$ npm i midway-casbin-sequelize-adapter @midwayjs/sequelize --save
```

启用 sequelize 组件。

```typescript
import { Configuration } from '@midwayjs/core';
import * as sequelize from '@midwayjs/sequelize';
import * as casbin from '@midwayjs/casbin';
import { join } from 'path';

@Configuration({
  imports: [
    // ...
    sequelize,
    casbin,
  ],
  importConfigs: [
    join(__dirname, 'config')
  ]
})
export class MainConfiguration {
}
```

配置适配器，下面以 sqlite 存储为例，mysql 的配置可以查看 sequelize 组件。

```typescript
import { MidwayAppInfo } from '@midwayjs/core';
import { join } from 'path';
import { CasbinRule, createAdapter } from 'midway-casbin-sequelize-adapter';

export default (appInfo: MidwayAppInfo) => {
  return {
    // ...
    typeorm: {
      dataSource: {
        // 为 casbin 定义了一个连接
        'node-casbin-official': {
          dialect: 'sqlite',
          sync: true,
          storage: join(appInfo.appDir, 'casbin.sqlite'),
          // 注意这里显式引入了 Entity
          entities: [CasbinRule],
        }
      }
    },
    casbin: {
      policyAdapter: createAdapter({
        // 配置了上面的连接名
        dataSourceName: 'node-casbin-official'
      }),
      // ...
    }
  };
}
```



## License

[MIT]((http://github.com/node-casbin/sequelize-adapter/blob/master/LICENSE))
