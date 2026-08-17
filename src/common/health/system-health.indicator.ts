import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { statfs, readFile } from 'fs/promises';
import * as os from 'os';

const CPU_FAILURE_THRESHOLD = 90;
const MEMORY_FAILURE_THRESHOLD = 90;
const DISK_FAILURE_THRESHOLD = 90;
const CPU_SAMPLE_INTERVAL_MS = 500;

@Injectable()
export class SystemHealthIndicator extends HealthIndicator {
  private readonly cpuCores = os.cpus().length;

  private lastCpuTimes = {
    idle: 0,
    total: 0,
  };

  private lastCpuCheckTime = 0;
  private cachedCpuUsage = 0;

  async checkCpu(): Promise<HealthIndicatorResult> {
    try {
      const usagePercent = await this.getCpuUsage();

      if (usagePercent >= CPU_FAILURE_THRESHOLD) {
        throw new Error(`CPU usage is ${usagePercent.toFixed(1)}%`);
      }

      return this.getStatus('cpu', true, {
        usagePercent: Number(usagePercent.toFixed(1)),
        cores: this.cpuCores,
      });
    } catch (error) {
      throw new HealthCheckError(
        'CPU health check failed',
        this.getStatus('cpu', false, {
          message: error instanceof Error ? error.message : 'unknown error',
        }),
      );
    }
  }

  async checkMemory(): Promise<HealthIndicatorResult> {
    try {
      const totalBytes = os.totalmem();
      const freeBytes = os.freemem();
      const usedBytes = totalBytes - freeBytes;

      const usagePercent =
        totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;

      if (usagePercent >= MEMORY_FAILURE_THRESHOLD) {
        throw new Error(`Memory usage is ${usagePercent.toFixed(1)}%`);
      }

      return this.getStatus('memory', true, {
        usagePercent: Number(usagePercent.toFixed(1)),
        totalBytes,
        freeBytes,
        usedBytes,
      });
    } catch (error) {
      throw new HealthCheckError(
        'Memory health check failed',
        this.getStatus('memory', false, {
          message: error instanceof Error ? error.message : 'unknown error',
        }),
      );
    }
  }

  async checkDisk(): Promise<HealthIndicatorResult> {
  try {
    const stats = await statfs(process.cwd());

    const blockSize = Number(stats.bsize);
    const totalBytes = Number(stats.blocks) * blockSize;
    const availableBytes = Number(stats.bavail) * blockSize;
    const usedBytes = totalBytes - availableBytes;

    const usagePercent =
      totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;

    if (usagePercent >= DISK_FAILURE_THRESHOLD) {
      throw new Error(`Disk usage is ${usagePercent.toFixed(1)}%`);
    }

    return this.getStatus('disk', true, {
      usagePercent: Number(usagePercent.toFixed(1)),
      totalBytes,
      availableBytes,
      usedBytes,
    });
  } catch (error) {
    throw new HealthCheckError(
      'Disk health check failed',
      this.getStatus('disk', false, {
        message: error instanceof Error ? error.message : 'unknown error',
      }),
    );
  }
}

  private async getCpuUsage(): Promise<number> {
    const now = Date.now();
    const currentTimes = await this.getCpuTimes();

    if (this.lastCpuCheckTime === 0) {
      this.lastCpuTimes = currentTimes;
      this.lastCpuCheckTime = now;

      return 0;
    }

    if (now - this.lastCpuCheckTime >= CPU_SAMPLE_INTERVAL_MS) {
      const idleDiff = currentTimes.idle - this.lastCpuTimes.idle;
      const totalDiff = currentTimes.total - this.lastCpuTimes.total;

      if (totalDiff > 0) {
        this.cachedCpuUsage =
          100 * (1 - idleDiff / totalDiff);
      }

      this.lastCpuTimes = currentTimes;
      this.lastCpuCheckTime = now;
    }

    return this.cachedCpuUsage;
  }

  private async getCpuTimes(): Promise<{
    idle: number;
    total: number;
  }> {
    if (process.platform === 'linux') {
      try {
        const contents = await readFile('/proc/stat', 'utf8');

        const cpuLine = contents
          .split('\n')
          .find((line) => line.startsWith('cpu '));

        if (cpuLine) {
          const values = cpuLine
            .trim()
            .split(/\s+/)
            .slice(1)
            .map(Number);

          const idle = values[3] + (values[4] ?? 0);
          const total = values.reduce(
            (sum, value) => sum + value,
            0,
          );

          return { idle, total };
        }
      } catch {
      }
    }

    const cpus = os.cpus();

    let idle = 0;
    let total = 0;

    for (const cpu of cpus) {
      idle += cpu.times.idle;

      total +=
        cpu.times.user +
        cpu.times.nice +
        cpu.times.sys +
        cpu.times.irq +
        cpu.times.idle;
    }

    return { idle, total };
  }
}