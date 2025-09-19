import React, { useState } from 'react';
import type { Step } from '../types/campaign.types';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SidebarProps {
  steps: Step[];
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
  onAddStep: () => void;
  onDeleteStep: (id: string) => void;
  onUpdateStepName: (id: string, newName: string) => void;
}

const EditableStepName: React.FC<{step: Step, onUpdateStepName: (id: string, newName: string) => void}> = ({ step, onUpdateStepName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(step.name);

    const handleSave = () => {
        onUpdateStepName(step.id, name);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="w-full bg-muted text-foreground text-sm"
                    autoFocus
                />
                <Button
                    onClick={handleSave}
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-primary hover:text-primary/80"
                >
                    <CheckIcon className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between group">
            <span className="truncate text-foreground">{step.name}</span>
            <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="icon"
                className="ml-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <PencilIcon className="w-3 h-3" />
            </Button>
        </div>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ steps, selectedStepId, onSelectStep, onAddStep, onDeleteStep, onUpdateStepName }) => {
  const [stepPendingDeletion, setStepPendingDeletion] = useState<string | null>(null);

  return (
    <aside className="w-64 bg-card text-foreground flex flex-col shadow-lg z-20 border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Campaign Flow</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="p-2">
          {steps.map((step, index) => (
            <li key={step.id}>
              {stepPendingDeletion === step.id ? (
                <div className="bg-destructive/10 p-3 my-1 rounded-md text-center text-sm transition-all duration-300 border border-destructive/20">
                  <p className="font-semibold mb-2 text-foreground">Delete this step?</p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => {
                        onDeleteStep(step.id);
                        setStepPendingDeletion(null);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => setStepPendingDeletion(null)}
                      variant="secondary"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center p-3 my-1 rounded-md cursor-pointer group transition-colors ${
                    selectedStepId === step.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  <div className={`flex-shrink-0 rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs ${
                    selectedStepId === step.id ? 'bg-primary-foreground text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3 text-sm font-medium flex-grow truncate">
                    <EditableStepName step={step} onUpdateStepName={onUpdateStepName} />
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStepPendingDeletion(step.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete step ${step.name}`}
                    title={`Delete step ${step.name}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-border">
        <Button
          onClick={onAddStep}
          className="w-full"
          variant="primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Step
        </Button>
      </div>
    </aside>
  );
};
