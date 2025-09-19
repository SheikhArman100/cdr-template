import React, { useState } from 'react';
import type { Step, ImageAsset, Question, TextSnippet, ContentContainerStyle, ContentItem } from '../types/campaign.types';
import { ImageLibrary } from './ImageLibrary';
import { QuestionBank } from './QuestionBank';
import { TextSnippetLibrary } from './TextSnippetLibrary';


interface InspectorPanelProps {
  selectedStep: Step | undefined;
  imageAssets: ImageAsset[];
  questions: Question[];
  textSnippets: TextSnippet[];
  onStyleChange: (style: Partial<ContentContainerStyle>) => void;
  onAddContent: (item: Omit<ContentItem, 'width' | 'height'>) => void;
  onSetBackground: (assetId: string) => void;
  onAddImageAsset: (asset: ImageAsset) => void;
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion: (question: Question) => void;
  onAddTextSnippet: (snippet: TextSnippet) => void;
  onUpdateTextSnippet: (snippet: TextSnippet) => void;
}

const StyleInspector: React.FC<{ style: ContentContainerStyle, onChange: (style: Partial<ContentContainerStyle>) => void }> = ({ style, onChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Background Color</label>
                <input type="color" value={style.backgroundColor.startsWith('rgba') ? '#ffffff' : style.backgroundColor} onChange={(e) => onChange({ backgroundColor: e.target.value })} className="w-full h-8 p-0 border-none cursor-pointer" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Border Color</label>
                <input type="color" value={style.borderColor} onChange={(e) => onChange({ borderColor: e.target.value })} className="w-full h-8 p-0 border-none cursor-pointer" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Border Thickness ({style.borderWidth}px)</label>
                <input type="range" min="0" max="20" value={style.borderWidth} onChange={(e) => onChange({ borderWidth: parseInt(e.target.value) })} className="w-full" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Text Color</label>
                <input type="color" value={style.textColor} onChange={(e) => onChange({ textColor: e.target.value })} className="w-full h-8 p-0 border-none cursor-pointer" />
            </div>
        </div>
    );
};

export const InspectorPanel: React.FC<InspectorPanelProps> = (props) => {
  const { selectedStep, onStyleChange, onAddContent, onSetBackground, onAddImageAsset, onAddQuestion, onUpdateQuestion, onAddTextSnippet, onUpdateTextSnippet } = props;
  const [activeTab, setActiveTab] = useState('library');
  const [activeLibraryTab, setActiveLibraryTab] = useState('images');

  if (!selectedStep) {
    return <aside className="w-96 bg-white border-l border-gray-200"></aside>;
  }

  const renderLibraryContent = () => {
    switch(activeLibraryTab) {
      case 'images':
        return <ImageLibrary imageAssets={props.imageAssets} onAddImageAsset={onAddImageAsset} onSelectImage={onSetBackground} />;
      case 'questions':
        return <QuestionBank questions={props.questions} onAddQuestion={onAddQuestion} onUpdateQuestion={onUpdateQuestion} onAddToStep={(id:any) => onAddContent({ type: 'QUESTION', id })} />;
      case 'text':
        return <TextSnippetLibrary textSnippets={props.textSnippets} onAddTextSnippet={onAddTextSnippet} onUpdateTextSnippet={onUpdateTextSnippet} onAddToStep={(id:any) => onAddContent({ type: 'TEXT_SNIPPET', id })} />;
      default:
        return null;
    }
  }

  return (
    <aside className="w-96 bg-white border-l border-gray-200 flex flex-col z-10">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button onClick={() => setActiveTab('library')} className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'library' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Library
          </button>
          <button onClick={() => setActiveTab('inspector')} className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'inspector' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Inspector
          </button>
        </nav>
      </div>

      <div className="flex-grow overflow-y-auto">
        {activeTab === 'library' && (
            <div>
                 <div className="border-b border-gray-200">
                    <nav className="flex justify-around -mb-px">
                         <button onClick={() => setActiveLibraryTab('images')} className={`flex-1 py-3 px-1 text-center border-b-2 font-medium text-xs ${activeLibraryTab === 'images' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}`}>Images</button>
                         <button onClick={() => setActiveLibraryTab('questions')} className={`flex-1 py-3 px-1 text-center border-b-2 font-medium text-xs ${activeLibraryTab === 'questions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}`}>Questions</button>
                         <button onClick={() => setActiveLibraryTab('text')} className={`flex-1 py-3 px-1 text-center border-b-2 font-medium text-xs ${activeLibraryTab === 'text' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}`}>Text Snippets</button>
                    </nav>
                </div>
                <div className="p-4">{renderLibraryContent()}</div>
            </div>
        )}
        {activeTab === 'inspector' && (
            <div className="p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Box Styles</h3>
                    <StyleInspector style={selectedStep.contentContainerStyle} onChange={onStyleChange} />
                </div>
            </div>
        )}
      </div>
    </aside>
  );
};
