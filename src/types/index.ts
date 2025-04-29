export type CustomNodeData = {
    label: string;
};

export type GlobalProperties = {
    label: string;
    fields: string[];
};

export interface NodeFieldMapping {
    nodeId: string;
    fields: any[]; // Or you can specify the exact structure of the fields here
  }

export interface PrefillMapping {
    targetNodeId: string;
    targetFieldName: string; 
    sourceNodeId: string; 
    sourceFieldName: string; 
}
