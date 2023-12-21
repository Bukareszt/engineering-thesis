import type { ColumnType } from "kysely";

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export interface ExecutableActions {
  address: string;
  description: string;
  id: string;
  name: string;
  user_id: string;
}

export interface Triggers {
  description: string;
  id: string;
  name: string;
  user_id: string;
}

export interface Users {
  id: string;
  password: string;
  username: string;
}

export interface Workflows {
  edges: Json;
  id: string;
  name: string;
  nodes: Json;
  user_id: string;
}

export interface DB {
  executable_actions: ExecutableActions;
  triggers: Triggers;
  users: Users;
  workflows: Workflows;
}
