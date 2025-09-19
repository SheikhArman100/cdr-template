import React, { useState } from 'react';
import type { ImageAsset } from '../types/campaign.types';
import { UploadIcon, XIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';

interface ImageLibraryProps {
  imageAssets: ImageAsset[];
  onAddImageAsset: (asset: ImageAsset) => void;
  onSelectImage: (assetId: string) => void;
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({ imageAssets, onAddImageAsset, onSelectImage }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');

  const handleAddImage = () => {
    if (newImageUrl && newImageName) {
      const newAsset: ImageAsset = {
        id: `img-${Date.now()}`,
        name: newImageName,
        url: newImageUrl,
      };
      onAddImageAsset(newAsset);
      setNewImageUrl('');
      setNewImageName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Image Library</h3>
        <Button onClick={() => setIsAdding(!isAdding)} variant="primary">
          <UploadIcon className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-name">Image Name</Label>
                <Input
                  id="image-name"
                  type="text"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  placeholder="Enter image name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleAddImage} variant="primary">
                  Add Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {imageAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => onSelectImage(asset.id)}
            className="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
          >
            <Image
              src={asset.url}
              alt={asset.name}
              height={96}
              width={96}
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Set as Background
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
              <p className="text-xs truncate">{asset.name}</p>
            </div>
          </div>
        ))}
      </div>

      {imageAssets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No images in library</p>
          <p className="text-sm">Add images to use as backgrounds</p>
        </div>
      )}
    </div>
  );
};
