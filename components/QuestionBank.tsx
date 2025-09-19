import React, { useState } from 'react';
import type { Question } from '../types/campaign.types';
import { QuestionType } from '../types/campaign.types';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon } from './icons';

interface QuestionBankProps {
  questions: Question[];
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion: (question: Question) => void;
  onAddToStep: (questionId: string) => void;
}

const QuestionForm: React.FC<{
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}> = ({ question, onSave, onCancel }) => {
  const [text, setText] = useState(question?.text || '');
  const [type, setType] = useState<QuestionType>(question?.type || QuestionType.TEXT);
  const [placeholder, setPlaceholder] = useState((question && 'placeholder' in question) ? question.placeholder || '' : '');
  const [options, setOptions] = useState<string[]>((question && 'options' in question) ? question.options || [] : []);

  const handleSave = () => {
    if (!text.trim()) return;

    let newQuestion: Question;

    if (type === QuestionType.TEXT) {
      newQuestion = {
        id: question?.id || `q-${Date.now()}`,
        text: text.trim(),
        type: QuestionType.TEXT,
        placeholder: placeholder.trim() || undefined,
      };
    } else if (type === QuestionType.DROPDOWN) {
      newQuestion = {
        id: question?.id || `q-${Date.now()}`,
        text: text.trim(),
        type: QuestionType.DROPDOWN,
        options: options.filter(opt => opt.trim()),
      };
    } else {
      newQuestion = {
        id: question?.id || `q-${Date.now()}`,
        text: text.trim(),
        type: QuestionType.DATE,
        placeholder: placeholder.trim() || undefined,
      };
    }

    onSave(newQuestion);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your question"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Question Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as QuestionType)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={QuestionType.TEXT}>Text Input</option>
          <option value={QuestionType.DROPDOWN}>Dropdown</option>
          <option value={QuestionType.DATE}>Date Picker</option>
        </select>
      </div>

      {type === QuestionType.TEXT && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Placeholder Text</label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      {type === QuestionType.DROPDOWN && (
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Options</label>
            <button
              onClick={addOption}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Option
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
          {question ? 'Update' : 'Add'} Question
        </button>
      </div>
    </div>
  );
};

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onAddToStep
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleAddQuestion = (question: Question) => {
    onAddQuestion(question);
    setIsAdding(false);
  };

  const handleUpdateQuestion = (question: Question) => {
    onUpdateQuestion(question);
    setEditingQuestion(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Question Bank</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>

      {isAdding && (
        <QuestionForm
          onSave={handleAddQuestion}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {editingQuestion && (
        <QuestionForm
          question={editingQuestion}
          onSave={handleUpdateQuestion}
          onCancel={() => setEditingQuestion(null)}
        />
      )}

      <div className="space-y-3">
        {questions.map((question) => (
          <div
            key={question.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{question.text}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Type: {question.type}
                  {'placeholder' in question && question.placeholder && ` • Placeholder: ${question.placeholder}`}
                </p>
                {'options' in question && question.options && question.options.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Options:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {question.options.map((option: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onAddToStep(question.id)}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Add to Step
                </button>
                <button
                  onClick={() => setEditingQuestion(question)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition"
                  title="Edit question"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p>No questions in bank</p>
          <p className="text-sm">Add questions to collect user responses</p>
        </div>
      )}
    </div>
  );
};
