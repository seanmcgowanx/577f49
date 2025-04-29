import React, { useEffect, useState, useCallback } from 'react';
import {
    ReactFlow,
    type Node,
    type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nanoid } from 'nanoid';
import PrefillPanel from './PrefillPanel';
import ConfigurationModal from './ConfigurationModal';
import { CustomNodeData, NodeFieldMapping, PrefillMapping } from '../types';

const DAGViewer = () => {
    // ===== State =====
    const [nodes, setNodes] = useState<Node<CustomNodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [graph, setGraph] = useState<{ [key: string]: string[] }>({});
    const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
    const [nodeFieldsMappings, setNodeFieldsMappings] = useState<NodeFieldMapping[]>([]);
    const [formPrefillToggles, setFormPrefillToggles] = useState<{ [key: string]: boolean }>({});
    const [prefillMappings, setPrefillMappings] = useState<PrefillMapping[]>([]);
    const [editingField, setEditingField] = useState<string | null>(null);

    // ===== Fetch Graph on Mount =====
    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const response = await fetch("/api/v1/123/actions/blueprints/bp_456/bpv_123/graph");
                const data = await response.json();

                const formattedNodes = data.nodes.map((node: any) => ({
                    id: node.id,
                    data: { label: node.data.name },
                    position: node.position,
                    sourcePosition: 'right',
                    targetPosition: 'left',
                }));

                const formattedEdges = data.edges.map((edge: any) => ({
                    id: nanoid(),
                    ...edge,
                }));

                const formData = data.forms;
                const componentToFormMap = new Map<string, string[]>();
                formData.forEach((form: any) => {
                    componentToFormMap.set(form.id, Object.keys(form.field_schema.properties));
                });

                const nodeFieldsMapping = data.nodes.map((node: any) => ({
                    nodeId: node.id,
                    fields: componentToFormMap.get(node.data.component_id) || [],
                }));

                const formPrefillToggleState = formattedNodes.reduce((acc: { [key: string]: boolean }, node: any) => {
                    acc[node.data.label] = true;
                    return acc;
                }, {});

                setNodes(formattedNodes);
                setEdges(formattedEdges);
                setNodeFieldsMappings(nodeFieldsMapping);
                setFormPrefillToggles(formPrefillToggleState);
            } catch (err) {
                console.error("Error fetching graph:", err);
            }
        };

        fetchGraph();
    }, []);

    // ===== Graph Construction =====
    const constructGraph = (nodes: Node<CustomNodeData>[], edges: Edge[]): { [key: string]: string[] } => {
        const graph: { [key: string]: string[] } = {};
        const idToLabelMap = new Map<string, string>();

        nodes.forEach(node => {
            idToLabelMap.set(node.id, node.data.label);
            graph[node.data.label] = [];
        });

        edges.forEach(edge => {
            const sourceLabel = idToLabelMap.get(edge.source)!;
            const targetLabel = idToLabelMap.get(edge.target)!;
            if (graph[targetLabel]) {
                graph[targetLabel].push(sourceLabel);
            }
        });

        return graph;
    };

    useEffect(() => {
        setGraph(constructGraph(nodes, edges));
    }, [nodes, edges]);

    // ===== Utility: Get Upstream Nodes =====
    const getUpstreamNodes = (nodeLabel: string, graph: { [key: string]: string[] }): string[] => {
        const visited = new Set<string>();

        const dfs = (current: string) => {
            for (const upstream of graph[current] || []) {
                if (!visited.has(upstream)) {
                    visited.add(upstream);
                    dfs(upstream);
                }
            }
        };

        dfs(nodeLabel);
        return Array.from(visited).sort();
    };

    // ===== Handlers =====
    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
        setSelectedNode(node);
    }, []);

    const handlePrefillPanelClose = () => {
        setSelectedNode(null);
    };

    const handleFieldConfigure = (field: string) => {
        setEditingField(field);
    };

    const handleModalClose = () => {
        setEditingField(null);
    };

    const handleSave = ({
        targetNodeId,
        targetFieldName,
        sourceNodeId,
        sourceFieldName,
    }: PrefillMapping) => {
        setPrefillMappings(prev => [
            ...prev,
            { targetNodeId, targetFieldName, sourceNodeId, sourceFieldName },
        ]);
        handleModalClose();
    };

    const handleDeleteMapping = (field: string) => {
        setPrefillMappings(prev =>
            prev.filter(mapping =>
                mapping.targetNodeId !== selectedNode?.data.label ||
                mapping.targetFieldName !== field
            )
        );
    };

    const handlePrefillToggle = (nodeLabel: string) => {
        setFormPrefillToggles(prev => ({
            ...prev,
            [nodeLabel]: !prev[nodeLabel],
        }));

        setPrefillMappings(prev =>
            prev.filter(mapping => mapping.sourceNodeId === nodeLabel)
        );
    };

    // ===== Render =====
    return (
        <div className="flow-container-wrapper">
            <div className="flow-container" data-testid="flow-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    onNodeClick={handleNodeClick}
                />
            </div>

            {selectedNode && (
                <PrefillPanel
                    handleClose={handlePrefillPanelClose}
                    selectedNode={selectedNode}
                    handleConfigure={handleFieldConfigure}
                    prefillMappings={prefillMappings}
                    handleDeleteMapping={handleDeleteMapping}
                    nodeFieldsMappings={nodeFieldsMappings}
                    formPrefillToggles={formPrefillToggles}
                    handlePrefillToggle={handlePrefillToggle}
                />
            )}

            {editingField && selectedNode && (
                <ConfigurationModal
                    editingField={editingField}
                    handleModalClose={handleModalClose}
                    handleSave={handleSave}
                    nodeFieldsMappings={nodeFieldsMappings}
                    selectedNode={selectedNode}
                    getUpstreamNodes={getUpstreamNodes}
                    graph={graph}
                />
            )}
        </div>
    );
};

export default DAGViewer;


