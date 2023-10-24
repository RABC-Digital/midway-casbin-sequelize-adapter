import { BaseAdapter } from '@midwayjs/casbin';
import {
  CasbinRuleConstructor,
  GenericCasbinRule,
  SequelizeAdapterConfig,
} from './interface';
import { Repository, Sequelize } from 'sequelize-typescript';
import { CasbinRule } from './casbinRule.entity';

export class SequelizeAdapter extends BaseAdapter<GenericCasbinRule> {
  private adapterConfig: SequelizeAdapterConfig;
  private sequelize: Sequelize;

  constructor(dataSource: Sequelize, options: SequelizeAdapterConfig) {
    super();
    this.sequelize = dataSource;
    this.adapterConfig = options;
  }

  private async clearTable() {
    await this.getRepository().destroy({ where: {}, truncate: true });
  }

  private static getCasbinRuleType(
    adapterConfig?: SequelizeAdapterConfig
  ): CasbinRuleConstructor {
    if (adapterConfig?.customCasbinRuleEntity) {
      return adapterConfig.customCasbinRuleEntity;
    }

    return CasbinRule;
  }

  protected getAdapterLine(): new () => GenericCasbinRule {
    return SequelizeAdapter.getCasbinRuleType(this.adapterConfig);
  }

  private getRepository(): Repository<GenericCasbinRule> {
    return this.sequelize.getRepository(this.getAdapterLine());
  }

  protected async loadPolicyByAdapter(): Promise<GenericCasbinRule[]> {
    return this.getRepository().findAll();
  }

  protected async loadPolicyWithFilterByAdapter(
    filter: any
  ): Promise<GenericCasbinRule[]> {
    return this.getRepository().findAll({ where: filter });
  }

  protected async savePolicyByAdapter(
    policies: GenericCasbinRule[]
  ): Promise<void> {
    await this.clearTable();

    const transaction = await this.sequelize.transaction();

    try {
      await this.getRepository().bulkCreate(
        policies.map(policy => policy.get({ plain: true })),
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  protected async removePolicyByAdapter(
    removePolicy: GenericCasbinRule,
    newestPolicies?: GenericCasbinRule[]
  ): Promise<void> {
    await this.getRepository().destroy({
      ...(removePolicy as any),
    });
  }
}
