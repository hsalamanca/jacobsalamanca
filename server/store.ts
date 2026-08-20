import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StudioData } from "../src/types";
import { emptyStudio } from "./seed";

const KEY = "jacob-studio-v1";

function filePath() {
  const root = process.env.VERCEL ? "/tmp" : process.cwd();
  return path.join(root, "data", "studio.json");
}

let memory: StudioData | null = null;
let chain: Promise<unknown> = Promise.resolve();

function lock<T>(fn: () => Promise<T>) {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function redisEnabled() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

async function fromRedis(): Promise<StudioData | null> {
  if (!redisEnabled()) return null;
  const { Redis } = await import("@upstash/redis");
  const data = await Redis.fromEnv().get<StudioData>(KEY);
  return data ?? null;
}

async function toRedis(data: StudioData) {
  if (!redisEnabled()) return;
  const { Redis } = await import("@upstash/redis");
  await Redis.fromEnv().set(KEY, data);
}

async function fromFile(): Promise<StudioData | null> {
  try {
    const raw = await readFile(filePath(), "utf8");
    return JSON.parse(raw) as StudioData;
  } catch {
    return null;
  }
}

async function toFile(data: StudioData) {
  const dest = filePath();
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, JSON.stringify(data, null, 2), "utf8");
}

function merge(data: StudioData): StudioData {
  const fresh = emptyStudio();
  return {
    work: data.work?.length ? data.work : fresh.work,
    prospects: data.prospects ?? [],
    customers: data.customers?.length ? data.customers : fresh.customers,
    campaigns: data.campaigns ?? fresh.campaigns,
    activities: data.activities ?? fresh.activities,
    templates: data.templates?.length ? data.templates : fresh.templates,
  };
}

async function loadRaw(): Promise<StudioData> {
  if (redisEnabled()) {
    const remote = await fromRedis();
    memory = merge(remote ?? emptyStudio());
    if (!remote) await persist(memory);
    return memory;
  }
  if (memory) return memory;
  const remote = await fromFile();
  memory = merge(remote ?? emptyStudio());
  if (!remote) await persist(memory);
  return memory;
}

async function persist(data: StudioData) {
  memory = data;
  await Promise.allSettled([toRedis(data), toFile(data)]);
}

export async function readStudio() {
  return lock(() => loadRaw());
}

export async function writeStudio(mutator: (data: StudioData) => void) {
  return lock(async () => {
    const data = await loadRaw();
    mutator(data);
    await persist(data);
    return data;
  });
}
