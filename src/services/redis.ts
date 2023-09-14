import { createClient } from "redis";

type RedisType = ReturnType<typeof createClient>;

export class Redis {
  private redisClient!: RedisType;

  constructor() {
    this.redisClient = createClient();
  }

  async connect() {
    try {
      await this.redisClient.connect();
      console.log("redis has connected");
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  async set(key: string, value: any) {
    await this.redisClient.set(key, JSON.stringify(value), {
      EX: 60 * 60 * 4,
    });
  }

  async exists(key: string, value: string): Promise<boolean> {
    const result = await this.redisClient.get(key);
    return value === JSON.parse(result as string);
  }

  async get(key: string) {
    const value = await this.redisClient.get(key);
    if (value) return JSON.parse(value as string);
    else return 0;
  }

  async increment(key: string) {
    await this.redisClient.INCRBY(key, 1);
  }

  async upSert(key: string, value: any) {
    await this.redisClient.set(key, JSON.stringify(value), {
      EX: 60 * 60 * 24,
    });
  }
}