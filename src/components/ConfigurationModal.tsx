import React, { useState, useEffect } from 'react';
import { GlobalProperties, NodeFieldMapping, CustomNodeData } from '../types';
import type { Node } from '@xyflow/react';
import '../App.css';
import { globalData } from '../services/globalData';

type ConfigurationModalProps = {
  editingField: string;
  handleModalClose: () => void;
  handleSave: (data: {
    targetNodeId: string;
    targetFieldName: string;
    sourceNodeId: string;
    sourceFieldName: string;
  }) => void;
  nodeFieldsMappings: NodeFieldMapping[];
  selectedNode: Node<CustomNodeData>;
  getUpstreamNodes: (nodeId: string, graph: { [key: string]: string[] }) => string[];
  graph: { [key: string]: string[] };
};

const ConfigurationModal = ({
  editingField,
  handleModalClose,
  handleSave,
  nodeFieldsMappings,
  selectedNode,
  getUpstreamNodes,
  graph,
}: ConfigurationModalProps) => {
  const [selectedUpstreamForm, setSelectedUpstreamForm] = useState<string | null>(null);
  const [selectedUpstreamField, setSelectedUpstreamField] = useState<string | null>(null);
  const [globalPropertiesList, setGlobalPropertiesList] = useState<GlobalProperties[]>([]);

  useEffect(() => {
    setGlobalPropertiesList(globalData);
  }, []);

  const handleUpstreamFormClick = (node: string) => {
    setSelectedUpstreamForm(node);
    setSelectedUpstreamField(null); // Reset when form changes
  };

  const handleUpstreamFieldClick = (field: string) => {
    setSelectedUpstreamField(field);
  };

  const selectedNodeFields = nodeFieldsMappings.find(
    mapping => mapping.nodeId === selectedNode.id
  )?.fields || [];

  return (
    <div className="configuration-modal-wrapper">
      <div className="configuration-modal" style={{ position: 'relative' }}>
        <h3>Configure Field: {editingField}</h3>
        <hr />
        <p><i>Select data element to map</i></p>

        {/* Global Properties Section */}
        {globalPropertiesList.map(property => (
          <div key={property.label} className="upstream-form">
            <p
              onClick={() => handleUpstreamFormClick(property.label)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedUpstreamForm === property.label ? '#D3D3D3' : 'transparent',
              }}
            >
              <strong>{property.label}</strong>
            </p>
            {selectedUpstreamForm === property.label && (
              <div className="upstream-form-fields">
                {property.fields.map(field => (
                  <p
                    key={field}
                    onClick={() => handleUpstreamFieldClick(field)}
                    style={{
                      cursor: 'pointer',
                      marginLeft: '20px',
                      backgroundColor: selectedUpstreamField === field ? '#90EE90' : 'transparent',
                    }}
                  >
                    {field}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Upstream Nodes Section */}
        {getUpstreamNodes(selectedNode.data.label, graph)?.map(nodeLabel => (
          <div key={nodeLabel} className="upstream-form">
            <p
              onClick={() => handleUpstreamFormClick(nodeLabel)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedUpstreamForm === nodeLabel ? '#D3D3D3' : 'transparent',
              }}
            >
              <strong>{nodeLabel}</strong>
            </p>
            {selectedUpstreamForm === nodeLabel && (
              <div className="upstream-form-fields">
                {selectedNodeFields.map(field => (
                  <p
                    key={field}
                    onClick={() => handleUpstreamFieldClick(field)}
                    style={{
                      cursor: 'pointer',
                      marginLeft: '20px',
                      backgroundColor: selectedUpstreamField === field ? '#90EE90' : 'transparent',
                    }}
                  >
                    {field}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Save and Cancel Buttons */}
        <div style={{ marginTop: '20px' }}>
          {selectedUpstreamForm && selectedUpstreamField && (
            <button
              onClick={() =>
                handleSave({
                  targetNodeId: selectedNode.data.label,
                  targetFieldName: editingField,
                  sourceNodeId: selectedUpstreamForm,
                  sourceFieldName: selectedUpstreamField,
                })
              }
            >
              Save
            </button>
          )}
          <button
            onClick={handleModalClose}
            style={{ marginLeft: selectedUpstreamForm && selectedUpstreamField ? '10px' : '0' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationModal;


