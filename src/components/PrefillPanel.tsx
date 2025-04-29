import React from 'react';
import type { Node } from '@xyflow/react';
import Switch from '@mui/material/Switch';
import '../App.css';
import { CustomNodeData, NodeFieldMapping, PrefillMapping } from '../types';

type PrefillPanelProps = {
  handleClose: () => void;
  selectedNode: Node<CustomNodeData>;
  handleConfigure: (field: string) => void;
  nodeFieldsMappings: NodeFieldMapping[];
  prefillMappings: PrefillMapping[] | null;
  handleDeleteMapping: (field: string) => void;
  formPrefillToggles: { [key: string]: boolean };
  handlePrefillToggle: (nodeLabel: string) => void;
};

const PrefillPanel = ({
  handleClose,
  selectedNode,
  handleConfigure,
  nodeFieldsMappings,
  prefillMappings,
  handleDeleteMapping,
  formPrefillToggles,
  handlePrefillToggle,
}: PrefillPanelProps) => {
  const selectedNodeFields =
    nodeFieldsMappings.find((mapping) => mapping.nodeId === selectedNode.id)?.fields || [];

  const isPrefillEnabled = formPrefillToggles[selectedNode.data.label];

  return (
    <div className="prefill-panel">
      <h3 data-testid="prefill-title">{selectedNode.data.label} Prefill Configuration</h3>
      <span>Prefill fields for this form</span>
      <Switch checked={isPrefillEnabled} onChange={() => handlePrefillToggle(selectedNode.data.label)} />

      <div className="form-fields">
        {selectedNodeFields.length > 0 && isPrefillEnabled ? (
          selectedNodeFields.map((field) => {
            const mapping = prefillMappings?.find(
              (m) => m.targetNodeId === selectedNode.data.label && m.targetFieldName === field
            );

            return (
              <div key={field} style={{ marginBottom: '10px' }}>
                <strong>Field: {field}</strong>
                <div>
                  <span>
                    {mapping ? `${mapping.sourceNodeId}: ${mapping.sourceFieldName}` : '[Not configured]'}
                  </span>
                  {mapping ? (
                    <button style={{ marginLeft: '10px' }} onClick={() => handleDeleteMapping(field)}>
                      X
                    </button>
                  ) : (
                    <button style={{ marginLeft: '10px' }} onClick={() => handleConfigure(field)}>
                      Configure
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No fields available for configuration.</p>
        )}
      </div>

      <button style={{ marginTop: '20px' }} onClick={handleClose}>
        Close Panel
      </button>
    </div>
  );
};

export default PrefillPanel;


