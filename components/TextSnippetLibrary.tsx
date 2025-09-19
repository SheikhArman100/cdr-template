import React, { useState } from 'react';
import type { TextSnippet } from '../types/campaign.types';
import { PlusIcon, PencilIcon, CheckIcon } from './icons';

interface TextSnippetLibraryProps {
  textSnippets: TextSnippet[];
  onAddTextSnippet: (snippet: TextSnippet) => void;
  onUpdateTextSnippet: (snippet: TextSnippet) => void;
  onAddToStep: (snippetId: string) => void;
}

const TextSnippetForm: React.FC<{
  snippet?: TextSnippet;
  onSave: (snippet: TextSnippet) => void;
  onCancel: () => void;
}> = ({ snippet, onSave, onCancel }) => {
  const [name, setName] = useState(snippet?.name || '');
  const [text, setText] = useState(snippet?.text || '');

  const handleSave = () => {
    if (!name.trim() || !text.trim()) return;

    const newSnippet: TextSnippet = {
      id: snippet?.id || `ts-${Date.now()}`,
      name: name.trim(),
      text: text.trim(),
    };

    onSave(newSnippet);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Snippet Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter snippet name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Snippet Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the text content for this snippet"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {snippet ? 'Update' : 'Add'} Snippet
        </button>
      </div>
    </div>
  );
};

export const TextSnippetLibrary: React.FC<TextSnippetLibraryProps> = ({
  textSnippets,
  onAddTextSnippet,
  onUpdateTextSnippet,
  onAddToStep
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<TextSnippet | null>(null);

  const handleAddSnippet = (snippet: TextSnippet) => {
    onAddTextSnippet(snippet);
    setIsAdding(false);
  };

  const handleUpdateSnippet = (snippet: TextSnippet) => {
    onUpdateTextSnippet(snippet);
    setEditingSnippet(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Text Snippets</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Snippet
        </button>
      </div>

      {isAdding && (
        <TextSnippetForm
          onSave={handleAddSnippet}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {editingSnippet && (
        <TextSnippetForm
          snippet={editingSnippet}
          onSave={handleUpdateSnippet}
          onCancel={() => setEditingSnippet(null)}
        />
      )}

      <div className="space-y-3">
        {textSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{snippet.name}</h4>
                <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                  {snippet.text}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onAddToStep(snippet.id)}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Add to Step
                </button>
                <button
                  onClick={() => setEditingSnippet(snippet)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition"
                  title="Edit snippet"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {textSnippets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p>No text snippets</p>
          <p className="text-sm">Add reusable text content for your campaigns</p>
        </div>
      )}
    </div>
  );
};
