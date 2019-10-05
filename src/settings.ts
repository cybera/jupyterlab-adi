import { JSONObject } from '@phosphor/coreutils';

export interface ConnectionSettings extends JSONObject {
  endpoint: string,
  apiKey: string
}

export interface ConfigSettings extends ConnectionSettings {
  organization: string
}
