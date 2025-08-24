export type HashData = {
  currentHash: string;
  storedHash: string;
  isValid: boolean;
  lastChecked: string;
  error?: string;
};

export type LogEntry = {
  id: string;
  event: string;
  timestamp: string;
  details: string;
};

export type BlockedEntry = {
  id: string;
  action: string;
  timestamp: string;
  details: string;
};
