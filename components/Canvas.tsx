"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Step, ImageAsset, Question, TextSnippet, ButtonContent, ContentItem } from '../types/campaign.types';
import { QuestionType } from '../types/campaign.types';
import { XIcon } from './icons';


interface CanvasProps {
  step: Step | undefined;
  imageAssets: ImageAsset[];
  questions: Question[];
  textSnippets: TextSnippet[];
  buttons: ButtonContent[];
  onRemoveContent: (index: number) => void;
  onReorderContent: (dragIndex: number, hoverIndex: number) => void;
  onResizeContent: (index: number, size: { width: number; height: number }) => void;
}

interface CanvasItemProps {
  item: ContentItem;
  index: number;
  questions: Question[];
  textSnippets: TextSnippet[];
  buttons: ButtonContent[];
  onRemoveContent: (index: number) => void;
  onReorderContent: (dragIndex: number, hoverIndex: number) => void;
  onResizeContent: (index: number, size: { width: number; height: number }) => void;
}

const ItemType = 'CanvasItem';

const QuestionRenderer: React.FC<{ question: Question }> = ({ question }) => {
    switch (question.type) {
        case QuestionType.TEXT:
            return <input type="text" placeholder={'placeholder' in question ? question.placeholder || 'Your answer...' : 'Your answer...'} className="w-full p-2 border border-gray-300 rounded-md" readOnly />;
        case QuestionType.DROPDOWN:
            return (
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                    <option value="">Select an option</option>
                    {'options' in question && question.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case QuestionType.DATE:
            return <input type="date" className="w-full p-2 border border-gray-300 rounded-md" readOnly />;
        default:
            return null;
    }
};

const CanvasItem: React.FC<CanvasItemProps> = ({ item, index, questions, textSnippets, buttons, onRemoveContent, onReorderContent, onResizeContent }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${item.id}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: item.width ? `${item.width}px` : 'auto',
    height: item.height ? `${item.height}px` : 'auto',
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const element = e.currentTarget.parentElement;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const startX = e.clientX;
    const startWidth = rect.width;
    const startHeight = rect.height;

    const doDrag = (e: MouseEvent) => {
      const newWidth = startWidth + e.clientX - startX;
      onResizeContent(index, { width: Math.max(150, newWidth), height: startHeight });
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const content = item.type === 'QUESTION'
    ? questions.find(q => q.id === item.id)
    : item.type === 'TEXT_SNIPPET'
    ? textSnippets.find(s => s.id === item.id)
    : item.type === 'BUTTON'
    ? buttons.find(b => b.id === item.id)
    : null;

  if (!content) return null;

  const renderContent = () => {
    if (item.type === 'TEXT_SNIPPET' && 'text' in content) {
      // Add basic styling for HTML elements
      const styledHtml = content.text
        .replace(/<h1>/gi, '<h1 style="font-size: 2em; font-weight: bold; margin: 0.5em 0;">')
        .replace(/<\/h1>/gi, '</h1>')
        .replace(/<h2>/gi, '<h2 style="font-size: 1.5em; font-weight: bold; margin: 0.4em 0;">')
        .replace(/<\/h2>/gi, '</h2>')
        .replace(/<h3>/gi, '<h3 style="font-size: 1.25em; font-weight: bold; margin: 0.3em 0;">')
        .replace(/<\/h3>/gi, '</h3>')
        .replace(/<h4>/gi, '<h4 style="font-size: 1.1em; font-weight: bold; margin: 0.25em 0;">')
        .replace(/<\/h4>/gi, '</h4>')
        .replace(/<h5>/gi, '<h5 style="font-size: 1em; font-weight: bold; margin: 0.2em 0;">')
        .replace(/<\/h5>/gi, '</h5>')
        .replace(/<h6>/gi, '<h6 style="font-size: 0.9em; font-weight: bold; margin: 0.15em 0;">')
        .replace(/<\/h6>/gi, '</h6>')
        .replace(/<p>/gi, '<p style="margin: 0.5em 0; line-height: 1.4;">')
        .replace(/<\/p>/gi, '</p>');

      return <div className="p-2" dangerouslySetInnerHTML={{ __html: styledHtml }} />;
    }
    if (item.type === 'QUESTION') {
      return (
        <div className="p-2 space-y-2">
          <label className="font-semibold text-sm">{content.text}</label>
          <QuestionRenderer question={content as Question} />
        </div>
      );
    }
    if (item.type === 'BUTTON' && 'text' in content) {
      return (
        <div className="p-2">
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            {content.text}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative my-2 bg-transparent border border-dashed border-transparent hover:border-blue-400 group cursor-move"
    >
      <button
        onClick={() => onRemoveContent(index)}
        className="absolute top-0 right-0 -m-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Remove item"
      >
        <XIcon className="w-3 h-3" />
      </button>

      {renderContent()}

      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute top-0 right-0 -mr-1 w-2 h-full cursor-col-resize opacity-0 group-hover:opacity-100"
      >
        <div className="w-full h-full bg-blue-500/50 rounded"></div>
      </div>
    </div>
  );
};

export const Canvas: React.FC<CanvasProps> = ({ step, imageAssets, questions, textSnippets, buttons, onRemoveContent, onReorderContent, onResizeContent }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = step?.contentItems.findIndex((item, index) => `${item.id}-${index}` === active.id);
      const newIndex = step?.contentItems.findIndex((item, index) => `${item.id}-${index}` === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== -1 && newIndex !== -1) {
        onReorderContent(oldIndex, newIndex);
      }
    }
  }

  if (!step) {
    return <div className="flex-1 flex items-center justify-center bg-gray-200"><p className="text-gray-500">Select a step to view its content.</p></div>;
  }

  const backgroundImage = imageAssets.find(img => img.id === step.backgroundAssetId);

  console.log('Canvas rendering with step:', step?.id, 'backgroundAssetId:', step?.backgroundAssetId);
  console.log('Found background image:', backgroundImage);

  return (
    <div
      className="flex-1 p-8 bg-gray-200 overflow-y-auto overflow-x-hidden h-full"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="p-8 rounded-lg shadow-2xl space-y-4 max-w-2xl w-full mx-auto"
        style={{
          backgroundColor: step.contentContainerStyle.backgroundColor,
          borderColor: step.contentContainerStyle.borderColor,
          borderWidth: `${step.contentContainerStyle.borderWidth}px`,
          color: step.contentContainerStyle.textColor,
          borderStyle: 'solid',
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={step.contentItems.map((item, index) => `${item.id}-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            {step.contentItems.map((item, index) => (
              <CanvasItem
                key={`${item.id}-${index}`}
                index={index}
                item={item}
                questions={questions}
                textSnippets={textSnippets}
                buttons={buttons}
                onRemoveContent={onRemoveContent}
                onReorderContent={onReorderContent}
                onResizeContent={onResizeContent}
              />
            ))}
          </SortableContext>
        </DndContext>
        {step.contentItems.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-400/50 rounded-lg">
            <p>This step is empty.</p>
            <p className="text-sm text-gray-500/80">Add content from the Library panel.</p>
          </div>
        )}
      </div>
    </div>
  );
};
