export interface Assessment {
  id: string;
  date: string;
  label: string;
  fileName: string;
  metrics: Record<string, number>;
}
