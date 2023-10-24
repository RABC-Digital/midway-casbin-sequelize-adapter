import { CasbinRule } from './casbinRule.entity';

export type GenericCasbinRule = CasbinRule;

export type CasbinRuleConstructor = new (...args: any[]) => GenericCasbinRule;

export interface SequelizeAdapterConfig {
  dataSourceName?: string;
  customCasbinRuleEntity?: CasbinRuleConstructor;
}
