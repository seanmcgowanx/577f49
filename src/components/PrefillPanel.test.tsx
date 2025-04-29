import { render, screen, fireEvent } from '@testing-library/react';
import PrefillPanel from './PrefillPanel';
import type { Node } from '@xyflow/react';
import { CustomNodeData } from '../types';

beforeEach(() => {
  jest.clearAllMocks();
});

const mockSelectedNode: Node<CustomNodeData> = {
  id: 'node-1',
  type: 'custom',
  data: { label: 'MyForm' },
  position: { x: 0, y: 0 },
};

const mockNodeFieldsMappings = [
  {
    nodeId: 'node-1',
    fields: ['name', 'email'],
  },
];

const mockPrefillMappings = [
  {
    targetNodeId: 'MyForm',
    targetFieldName: 'name',
    sourceNodeId: 'SourceForm',
    sourceFieldName: 'first_name',
  },
];

const mockToggle = jest.fn();
const mockConfigure = jest.fn();
const mockDeleteMapping = jest.fn();
const mockClose = jest.fn();

// Helper function to render PrefillPanel
const renderPrefillPanel = (formPrefillToggles: { [key: string]: boolean }) => {
  return render(
    <PrefillPanel
      handleClose={mockClose}
      selectedNode={mockSelectedNode}
      handleConfigure={mockConfigure}
      nodeFieldsMappings={mockNodeFieldsMappings}
      prefillMappings={mockPrefillMappings}
      handleDeleteMapping={mockDeleteMapping}
      formPrefillToggles={formPrefillToggles}
      handlePrefillToggle={mockToggle}
    />
  );
};

test('renders PrefillPanel with fields and buttons', () => {
  renderPrefillPanel({ MyForm: true });

  expect(screen.getByText(/MyForm Prefill Configuration/i)).toBeInTheDocument();
  expect(screen.getByRole('checkbox')).toBeChecked();
  expect(screen.getByText(/Field: name/i)).toBeInTheDocument();
  expect(screen.getByText(/SourceForm: first_name/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /close panel/i }));
  expect(mockClose).toHaveBeenCalled();
});

test('shows fallback message when no fields or prefill disabled', () => {
  renderPrefillPanel({ MyForm: false });

  expect(screen.getByText(/no fields available for configuration/i)).toBeInTheDocument();
});

test('clicking Configure button calls handleConfigure with field name', () => {
  renderPrefillPanel({ MyForm: true });

  const configureButton = screen.getByRole('button', { name: /configure/i });
  fireEvent.click(configureButton);
  expect(mockConfigure).toHaveBeenCalledWith('email');
});

test('toggling the switch calls handlePrefillToggle with node label', () => {
  renderPrefillPanel({ MyForm: true });

  const switchInput = screen.getByRole('checkbox');
  fireEvent.click(switchInput);
  expect(mockToggle).toHaveBeenCalledWith('MyForm');
});

test('clicking the "Close Panel" button calls handleClose', () => {
  renderPrefillPanel({ MyForm: true });

  const closeButton = screen.getByRole('button', { name: /close panel/i });
  fireEvent.click(closeButton);

  expect(mockClose).toHaveBeenCalledTimes(1);
});

test('clicking Configure button calls handleConfigure with field name (no prefill mappings)', () => {
  render(
    <PrefillPanel
      handleClose={mockClose}
      selectedNode={mockSelectedNode}
      handleConfigure={mockConfigure}
      nodeFieldsMappings={mockNodeFieldsMappings}
      prefillMappings={[]}
      formPrefillToggles={{ MyForm: true }}
      handleDeleteMapping={mockDeleteMapping}
      handlePrefillToggle={mockToggle}
    />
  );

  const configureButtonForName = screen.getByText(/Field: name/i)
    .closest('div')
    ?.querySelector('button');
  
  fireEvent.click(configureButtonForName as HTMLButtonElement);
  expect(mockConfigure).toHaveBeenCalledWith('name');
});

test('clicking "X" delete button calls handleDeleteMapping with correct field', () => {
  render(
    <PrefillPanel
      handleClose={mockClose}
      selectedNode={mockSelectedNode}
      handleConfigure={mockConfigure}
      nodeFieldsMappings={mockNodeFieldsMappings}
      prefillMappings={[
        {
          targetNodeId: 'MyForm',
          targetFieldName: 'email',
          sourceNodeId: 'SourceForm',
          sourceFieldName: 'email_address',
        },
      ]}
      formPrefillToggles={{ MyForm: true }}
      handleDeleteMapping={mockDeleteMapping}
      handlePrefillToggle={mockToggle}
    />
  );

  const deleteButton = screen.getByRole('button', { name: 'X' });
  fireEvent.click(deleteButton);
  expect(mockDeleteMapping).toHaveBeenCalledWith('email');
});


  
  
  
  
  