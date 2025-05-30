import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, deleteFile } from '@/utils/fileUpload';
import { ImagePlus, X } from 'lucide-react';

interface PortfolioUploadProps {
  userId: string;
  currentUrls: string[];
  onUrlsUpdate: (urls: string[]) => void;
}

const PortfolioUpload: React.FC<PortfolioUploadProps> = ({
  userId,
  currentUrls,
  onUrlsUpdate
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Please upload only image files.",
            variant: "destructive"
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload images smaller than 5MB.",
            variant: "destructive"
          });
          continue;
        }

        const result = await uploadFile(file, 'portfolio-images', userId);
        
        if (result.error) {
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive"
          });
          continue;
        }

        newUrls.push(result.url);
      }

      if (newUrls.length > 0) {
        onUrlsUpdate([...currentUrls, ...newUrls]);
        toast({
          title: "Upload successful",
          description: "Your portfolio images have been uploaded.",
        });
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your images.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (url: string) => {
    try {
      const path = url.split('/').pop();
      if (!path) return;

      const { error } = await deleteFile('portfolio-images', path);
      
      if (error) throw error;

      const updatedUrls = currentUrls.filter(u => u !== url);
      onUrlsUpdate(updatedUrls);
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from your portfolio.",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {currentUrls.map((url, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-2">
              <img
                src={url}
                alt={`Portfolio image ${index + 1}`}
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteImage(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Card className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                {isUploading ? 'Uploading...' : 'Add Images'}
              </span>
            </CardContent>
          </Card>
        </label>
      </div>
    </div>
  );
};

export default PortfolioUpload; 