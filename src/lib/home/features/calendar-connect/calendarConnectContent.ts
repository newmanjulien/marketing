export type ConnectionSetting = {
  label: string;
  value: string;
};

export const connectionSettings = [
  { label: 'provider', value: 'Outlook' },
  { label: 'access', value: 'Read only' },
  { label: 'retention', value: 'Zero' },
  { label: 'shared', value: 'Never' },
  { label: 'encryption', value: 'End-to-end' },
  { label: 'revoke', value: 'Anytime' }
] as const satisfies readonly ConnectionSetting[];
