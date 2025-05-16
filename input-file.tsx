import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface InputFileProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange?: (file: File | null) => void;
  previewUrl?: string | null;
  onClearFile?: () => void;
  label?: string;
  helperText?: string;
  containerClassName?: string;
}

const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
  ({ 
    className, 
    onFileChange, 
    previewUrl, 
    onClearFile, 
    label, 
    helperText,
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);
    
    const handleDrag = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    }, []);
    
    const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileChange?.(e.dataTransfer.files[0]);
      }
    }, [onFileChange]);
    
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileChange?.(e.target.files[0]);
      }
    }, [onFileChange]);
    
    return (
      <div className={containerClassName}>
        {label && <Label htmlFor={id} className="mb-2 block">{label}</Label>}
        
        <div 
          className={cn(
            "border-2 border-dashed border-gray-600 rounded-md",
            dragActive && "border-primary",
            className
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto rounded-md mx-auto" 
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={onClearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-300 mb-2">
                Drag & drop your image here or click to browse
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                className="mt-2"
              >
                Upload Image
              </Button>
              {helperText && (
                <p className="text-xs text-gray-400 mt-2">{helperText}</p>
              )}
            </div>
          )}
          
          <input
            id={id}
            type="file"
            ref={(e) => {
              // Assign to both refs
              if (e) {
                if (typeof ref === 'function') ref(e);
                else if (ref) ref.current = e;
                inputRef.current = e;
              }
            }}
            className="hidden"
            onChange={handleChange}
            {...props}
          />
        </div>
      </div>
    );
  }
);

InputFile.displayName = "InputFile";

export { InputFile };
