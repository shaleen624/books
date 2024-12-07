export interface DatabaseHandler {
  getAll(schemaName: string, options?: GetAllOptions): Promise<DocValueMap[]>;
  insert(schemaName: string, doc: DocValueMap): Promise<DocValueMap>;
  // ... other methods
}

export interface AuthHandler {
  user?: {
    email: string;
  };
} 