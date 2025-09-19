import React, { useState } from 'react';
import type { ImageAsset } from '../types/campaign.types';
import { UploadIcon, XIcon } from './icons';

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
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <UploadIcon className="w-4 h-4 mr-2" />
          Add Image
        </button>
      </div>

      {isAdding && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image Name</label>
              <input
                type="text"
                value={newImageName}
                onChange={(e) => setNewImageName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImage}
                className="px-4 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {imageAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => onSelectImage(asset.id)}
            className="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
          >
            <img
              src={asset.url}
              alt={asset.name}
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
