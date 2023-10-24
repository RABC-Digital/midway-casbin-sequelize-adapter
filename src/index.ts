import { IMidwayContainer } from '@midwayjs/core';
import { SequelizeAdapterConfig } from './interface';
import { SequelizeDataSourceManager } from '@midwayjs/sequelize';
import { SequelizeAdapter } from './adapter';

export * from './adapter';
export * from './casbinRule.entity';

export function createAdapter(options: SequelizeAdapterConfig) {
  return async (container: IMidwayContainer) => {
    const sequelizeDataSourceManager = await container.getAsync(
      SequelizeDataSourceManager
    );
    const dataSource = sequelizeDataSourceManager.getDataSource(
      options.dataSourceName
    );
    return new SequelizeAdapter(dataSource, options);
  };
}
