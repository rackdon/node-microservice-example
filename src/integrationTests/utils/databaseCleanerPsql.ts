import { Pool } from "pg";

export class DatabaseCleanerPsql {
  readonly client: Pool
  readonly versionControlTableNames = ['pgmigrations']

  constructor(client: Pool) {
    this.client = client
  }

  async getTableNames(): Promise<string[]> {
    const result = await this.client.query(
      `select * from information_schema.tables where table_schema='public' and table_name not in ($1)`,
      [this.versionControlTableNames.join(',')])
    return result.rows.map(r => r.table_name)
  }

  async truncate(tables?: string[], excludedTables?: string[]): Promise<void> {
    const finalTables = (tables ||  await this.getTableNames()).filter(t => !excludedTables?.includes(t))
    await this.client.query(`truncate ${finalTables.join(',')} cascade`)



  }
}