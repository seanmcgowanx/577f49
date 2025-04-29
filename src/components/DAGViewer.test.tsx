import { render, screen } from '@testing-library/react';
import DAGViewer from './DAGViewer';  

jest.mock('nanoid', () => ({ nanoid: () => '123' }));
jest.mock('@xyflow/react', () => ({
  ReactFlow: ({ children }: any) => <div data-testid="react-flow-wrapper">{children}</div>, 
}));


test('renders DAGViewer without crashing', async () => {
    render(<DAGViewer />);
    
    // Check if the ReactFlow container exists
    const flowContainer = screen.getByTestId('flow-container');
    expect(flowContainer).toBeInTheDocument();
});










