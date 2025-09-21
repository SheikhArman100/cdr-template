import React, { useState } from 'react';
import type { ButtonContent } from '../types/campaign.types';
import { PlusIcon, PencilIcon, TrashIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface ButtonLibraryProps {
  buttons: ButtonContent[];
  onAddButton: (button: ButtonContent) => void;
  onUpdateButton: (button: ButtonContent) => void;
  onDeleteButton?: (buttonId: string) => void;
  onAddToStep: (buttonId: string) => void;
}

const ButtonForm: React.FC<{
  button?: ButtonContent;
  onSave: (button: ButtonContent) => void;
  onCancel: () => void;
}> = ({ button, onSave, onCancel }) => {
  const [text, setText] = useState(button?.text || '');

  const handleSave = () => {
    if (!text.trim()) return;

    const newButton: ButtonContent = {
      id: button?.id || `btn-${Date.now()}`,
      text: text.trim(),
      isDefault: button?.isDefault || false,
    };

    onSave(newButton);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter button text (e.g., Sign In, Next, Submit)"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} variant="primary">
              {button ? 'Update' : 'Add'} Button
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ButtonLibrary: React.FC<ButtonLibraryProps> = ({
  buttons,
  onAddButton,
  onUpdateButton,
  onDeleteButton,
  onAddToStep
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingButton, setEditingButton] = useState<ButtonContent | null>(null);

  const handleAddButton = (button: ButtonContent) => {
    onAddButton(button);
    setIsAdding(false);
  };

  const handleUpdateButton = (button: ButtonContent) => {
    onUpdateButton(button);
    setEditingButton(null);
  };

  // Separate default and custom buttons
  const defaultButtons = buttons.filter(btn => btn.isDefault);
  const customButtons = buttons.filter(btn => !btn.isDefault);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Button Library</h3>
        <Button onClick={() => setIsAdding(true)} variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Button
        </Button>
      </div>

      {isAdding && (
        <ButtonForm
          onSave={handleAddButton}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {editingButton && (
        <ButtonForm
          button={editingButton}
          onSave={handleUpdateButton}
          onCancel={() => setEditingButton(null)}
        />
      )}

      <div className="space-y-3">
        {/* Default Buttons Section */}
        {defaultButtons.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Default Buttons</h4>
            {defaultButtons.map((button) => (
              <Card key={button.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="pointer-events-none"
                      >
                        {button.text}
                      </Button>
                      <span className="text-sm text-muted-foreground">Default</span>
                    </div>
                    <Button
                      onClick={() => onAddToStep(button.id)}
                      variant="primary"
                      size="sm"
                    >
                      + Add to Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Custom Buttons Section */}
        {customButtons.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Custom Buttons</h4>
            {customButtons.map((button) => (
              <Card key={button.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="pointer-events-none"
                      >
                        {button.text}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onAddToStep(button.id)}
                        variant="primary"
                        size="sm"
                      >
                        + Add to Step
                      </Button>
                      <Button
                        onClick={() => setEditingButton(button)}
                        variant="ghost"
                        size="icon"
                        title="Edit button"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      {onDeleteButton && (
                        <Button
                          onClick={() => onDeleteButton(button.id)}
                          variant="ghost"
                          size="icon"
                          title="Delete button"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {buttons.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50 bg-muted rounded-full flex items-center justify-center">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <CardTitle className="text-lg text-foreground mb-2">No buttons</CardTitle>
            <CardDescription className="text-center">
              Add interactive buttons for your campaign navigation and actions.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
