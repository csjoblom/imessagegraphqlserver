/**
 * Declaration file for external modules
 */

declare module 'running-at' {
  interface Result {
    ip: string;
    address: string;
    port?: number;
    protocol?: string;
  }
  
  export default function runningAt(): Promise<Result>;
}

declare module '@devsnowflake/text-emoji-parser' {
  export function parse(text: string): string;
} 