import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LogoUploadProps {
  onLogoChange: (logoUrl: string | null) => void;
  currentLogo: string | null;
}

export default function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      localStorage.setItem("concealed-florida-logo", result);
      onLogoChange(result);
      toast({
        title: "Logo uploaded successfully",
        description: "Your Florida Panther logo has been updated",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveLogo = () => {
    localStorage.removeItem("concealed-florida-logo");
    onLogoChange(null);
    toast({
      title: "Logo removed",
      description: "Logo has been reset to default",
    });
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-700 bg-gray-900/50"
        }`}
      >
        {currentLogo ? (
          <div className="space-y-4">
            <img
              src={currentLogo}
              alt="Uploaded logo"
              className="w-32 h-32 mx-auto object-contain rounded-lg"
              data-testid="img-uploaded-logo"
            />
            <div className="flex gap-2 justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById("logo-upload")?.click()}
                data-testid="button-change-logo"
              >
                <Upload className="w-4 h-4 mr-2" />
                Change Logo
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveLogo}
                data-testid="button-remove-logo"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-500" />
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                Drag and drop your Florida Panther logo here
              </p>
              <p className="text-gray-500 text-xs">or</p>
              <Button
                variant="secondary"
                onClick={() => document.getElementById("logo-upload")?.click()}
                data-testid="button-upload-logo"
              >
                Browse Files
              </Button>
            </div>
            <p className="text-gray-600 text-xs">
              Supports PNG, JPG, GIF (Max 5MB)
            </p>
          </div>
        )}
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          data-testid="input-logo-upload"
        />
      </div>
    </div>
  );
}
