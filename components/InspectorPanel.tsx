import React, { useState } from 'react';
import type { Step, ImageAsset, Question, TextSnippet, ContentContainerStyle, ContentItem } from '../types/campaign.types';
import { ImageLibrary } from './ImageLibrary';
import { QuestionBank } from './QuestionBank';
import { TextSnippetLibrary } from './TextSnippetLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';


interface InspectorPanelProps {
  selectedStep: Step | undefined;
  imageAssets: ImageAsset[];
  questions: Question[];
  textSnippets: TextSnippet[];
  onStyleChange: (style: Partial<ContentContainerStyle>) => void;
  onAddContent: (item: Omit<ContentItem, 'width' | 'height'>) => void;
  onSetBackground: (assetId: string | null) => void;
  onAddImageAsset: (asset: ImageAsset) => void;
  onRemoveImageAsset?: (assetId: string) => void;
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onAddTextSnippet: (snippet: TextSnippet) => void;
  onUpdateTextSnippet: (snippet: TextSnippet) => void;
}

const StyleInspector: React.FC<{ style: ContentContainerStyle, onChange: (style: Partial<ContentContainerStyle>) => void }> = ({ style, onChange }) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="background-color">Background Color</Label>
                <Input id="background-color" type="color" value={style.backgroundColor.startsWith('rgba') ? '#ffffff' : style.backgroundColor} onChange={(e) => onChange({ backgroundColor: e.target.value })} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="border-color">Border Color</Label>
                <Input id="border-color" type="color" value={style.borderColor} onChange={(e) => onChange({ borderColor: e.target.value })} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="border-width">Border Thickness ({style.borderWidth}px)</Label>
                <Input id="border-width" type="range" min="0" max="20" value={style.borderWidth} onChange={(e) => onChange({ borderWidth: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <Input id="text-color" type="color" value={style.textColor} onChange={(e) => onChange({ textColor: e.target.value })} />
            </div>
        </div>
    );
};

export const InspectorPanel: React.FC<InspectorPanelProps> = (props) => {
  const { selectedStep, onStyleChange, onAddContent, onSetBackground, onAddImageAsset, onRemoveImageAsset, onAddQuestion, onUpdateQuestion, onDeleteQuestion, onAddTextSnippet, onUpdateTextSnippet } = props;
  const [activeTab, setActiveTab] = useState('library');
  const [activeLibraryTab, setActiveLibraryTab] = useState('images');

  if (!selectedStep) {
    return <aside className="w-96 bg-white border-l border-gray-200"></aside>;
  }

  const renderLibraryContent = () => {
    switch(activeLibraryTab) {
      case 'images':
        return <ImageLibrary imageAssets={props.imageAssets} onAddImageAsset={onAddImageAsset} onSelectImage={onSetBackground} onRemoveImageAsset={onRemoveImageAsset} />;
      case 'questions':
        return <QuestionBank questions={props.questions} onAddQuestion={onAddQuestion} onUpdateQuestion={onUpdateQuestion} onDeleteQuestion={onDeleteQuestion} onAddToStep={(id:any) => onAddContent({ type: 'QUESTION', id })} />;
      case 'text':
        return <TextSnippetLibrary textSnippets={props.textSnippets} onAddTextSnippet={onAddTextSnippet} onUpdateTextSnippet={onUpdateTextSnippet} onAddToStep={(id:any) => onAddContent({ type: 'TEXT_SNIPPET', id })} />;
      default:
        return null;
    }
  }

  return (
    <aside className="w-96 bg-white border-l border-gray-200 flex flex-col z-10 overflow-y-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2" variant="line">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="inspector">Inspector</TabsTrigger>
        </TabsList>

        <div className="flex-grow overflow-y-auto">
          <TabsContent value="library" className="mt-0">
            <Tabs value={activeLibraryTab} onValueChange={setActiveLibraryTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="text">Text Snippets</TabsTrigger>
              </TabsList>
              <div className="p-4">{renderLibraryContent()}</div>
            </Tabs>
          </TabsContent>
          <TabsContent value="inspector" className="mt-0">
            <Card className="m-4">
              <CardHeader>
                <CardTitle>Content Box Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <StyleInspector style={selectedStep.contentContainerStyle} onChange={onStyleChange} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};
