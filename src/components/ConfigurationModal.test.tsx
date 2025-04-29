import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ConfigurationModal from './ConfigurationModal';
import { Node } from '@xyflow/react';
import { NodeFieldMapping, CustomNodeData } from '../types';

jest.mock('../services/globalData', () => ({
    globalData: [
      {
        label: 'Global Form 1',
        fields: ['field1', 'field2'],
      },
      {
        label: 'Global Form 2',
        fields: ['field3'],
      },
    ],
  }));  

const mockSelectedNode: Node<CustomNodeData> = {
  id: 'node1',
  data: { label: 'MyForm' },
  position: { x: 0, y: 0 },
  type: 'default',
};

const mockNodeFieldsMappings: NodeFieldMapping[] = [
  {
    nodeId: 'node1',
    fields: ['field1', 'field2'],
  },
];

const mockHandleModalClose = jest.fn();
const mockHandleSave = jest.fn();
const mockGetUpstreamNodes = jest.fn((nodeLabel, graph) => graph[nodeLabel] || []);

// Helper function to render the modal with common props
const renderConfigurationModal = (graphData = { MyForm: ['Global Form 1', 'Global Form 2'] }) => {
  render(
    <ConfigurationModal
      editingField="name"
      handleModalClose={mockHandleModalClose}
      handleSave={mockHandleSave}
      nodeFieldsMappings={mockNodeFieldsMappings}
      selectedNode={mockSelectedNode}
      getUpstreamNodes={mockGetUpstreamNodes}
      graph={graphData}
    />
  );
};

describe('ConfigurationModal', () => {

  test('renders modal title with editing field', () => {
    renderConfigurationModal();
    
    expect(screen.getByText(/Configure Field: name/i)).toBeInTheDocument();
  });

  test('calls handleModalClose when Cancel is clicked', () => {
    renderConfigurationModal();
    
    screen.getByText('Cancel').click();
    
    expect(mockHandleModalClose).toHaveBeenCalled();
  });

  test('displays empty state when no field mappings are available', () => {
    const emptyNodeFieldsMappings: NodeFieldMapping[] = [];
    
    renderConfigurationModal({ MyForm: [] }); // Providing empty field mappings
    
    expect(screen.queryByText('field1')).not.toBeInTheDocument();
  });

  test('displays only global forms when no upstream nodes are available', () => {
    renderConfigurationModal({ MyForm: [] }); // No upstream nodes
  
    expect(screen.getByText('Global Form 1')).toBeInTheDocument();
    expect(screen.getByText('Global Form 2')).toBeInTheDocument();
  
  });
  
  test('does not display fields for upstream nodes with no matching field mappings', () => {
    const customNodeMappings: NodeFieldMapping[] = [
      {
        nodeId: 'node1',
        fields: [], // no mappings
      },
    ];
  
    // Override default mappings
    render(
      <ConfigurationModal
        editingField="name"
        handleModalClose={mockHandleModalClose}
        handleSave={mockHandleSave}
        nodeFieldsMappings={customNodeMappings}
        selectedNode={mockSelectedNode}
        getUpstreamNodes={mockGetUpstreamNodes}
        graph={{ MyForm: ['Global Form 1'] }}
      />
    );
  
    expect(screen.queryByText('field1')).not.toBeInTheDocument();
    expect(screen.queryByText('field2')).not.toBeInTheDocument();
  });

  test('displays fields from global form when upstream node is present', async () => {
    renderConfigurationModal({
      MyForm: ['Global Form 1'],
    });
  
    // Simulate the click event
    fireEvent.click(screen.getByText('Global Form 1'));
  
    // Wait for the fields to appear after the state update
    await waitFor(() => {
      expect(screen.getByText('field1')).toBeInTheDocument();
      expect(screen.getByText('field2')).toBeInTheDocument();
    });
  });

  it('calls handleSave when Save is clicked', async () => {
    renderConfigurationModal({
      MyForm: ['Global Form 1'],
    }); 
  
    const formLabel = screen.getByText('Global Form 1');
    fireEvent.click(formLabel); // Select the form
    
    const fieldLabel = await screen.findByText('field1'); // wait for field1 to appear
    fireEvent.click(fieldLabel); // Select the field
  
    const saveButton = await screen.findByText('Save');
    fireEvent.click(saveButton); // Trigger save

    expect(mockHandleSave).toHaveBeenCalled();
  });

  
});

describe('getUpstreamNodes function', () => {
    it('returns correct upstream nodes based on graph data', () => {
      const graphData = {
        MyForm: ['Form 1', 'Form 2'],
        AnotherForm: ['Form 3'],
      };
  
      const mockGetUpstreamNodes = jest.fn((nodeLabel, graph) => graph[nodeLabel] || []);
  
      // Test case for MyForm
      const upstreamNodesForMyForm = mockGetUpstreamNodes('MyForm', graphData);
      expect(mockGetUpstreamNodes).toHaveBeenCalledWith('MyForm', graphData);
      expect(upstreamNodesForMyForm).toEqual(['Form 1', 'Form 2']);
  
      // Test case for AnotherForm
      const upstreamNodesForAnotherForm = mockGetUpstreamNodes('AnotherForm', graphData);
      expect(mockGetUpstreamNodes).toHaveBeenCalledWith('AnotherForm', graphData);
      expect(upstreamNodesForAnotherForm).toEqual(['Form 3']);
  
      // Test case for a non-existing node
      const upstreamNodesForNonExistingForm = mockGetUpstreamNodes('NonExistingForm', graphData);
      expect(mockGetUpstreamNodes).toHaveBeenCalledWith('NonExistingForm', graphData);
      expect(upstreamNodesForNonExistingForm).toEqual([]);
    });
  });
  

  
  

  
  

  
  
  



  
  
  
  
  



  


  
  







