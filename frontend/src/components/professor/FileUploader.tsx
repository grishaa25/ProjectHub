
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui-custom/Button";
import { FileUp, X, FileText, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  accept?: string;
}

export const FileUploader = ({
  onFilesUploaded,
  maxFileSize = 10, // 10MB by default
  maxFiles = 5,
  accept = ".pdf,.doc,.docx,.zip,.ppt,.pptx",
}: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate file size
    const oversizedFiles = selectedFiles.filter(
      file => file.size > maxFileSize * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `${oversizedFiles.length} file(s) exceed the maximum size of ${maxFileSize}MB`,
        variant: "destructive",
      });
      return;
    }
    
    // Check if we're exceeding the max number of files
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} files`,
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload progress
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setUploadProgress(0);
        const updatedFiles = [...files, ...selectedFiles];
        setFiles(updatedFiles);
        onFilesUploaded(updatedFiles);
      }
    }, 200);
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    
    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "zip":
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept={accept}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || files.length >= maxFiles}
          className="w-full h-20 border-dashed flex flex-col gap-2"
        >
          <FileUp className="h-5 w-5" />
          <span>
            {files.length === 0
              ? "Click to upload files"
              : `Upload more files (${files.length}/${maxFiles})`}
          </span>
        </Button>
      </div>
      
      {uploading && (
        <div className="space-y-1">
          <div className="text-xs flex justify-between">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
      
      {files.length > 0 && (
        <ul className="border rounded-md divide-y">
          {files.map((file, index) => (
            <li 
              key={index}
              className="flex justify-between items-center p-2 text-sm"
            >
              <div className="flex items-center">
                {getFileIcon(file.name)}
                <span className="ml-2 mr-2">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
      
      {files.length === 0 && !uploading && (
        <div className="text-center text-xs text-muted-foreground py-2">
          <AlertCircle className="h-4 w-4 mx-auto mb-1" />
          No files uploaded yet
        </div>
      )}
    </div>
  );
};
