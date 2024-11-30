import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

interface AddMemoryFormProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  description: string;
}

const AddMemoryForm = ({
  onFileChange,
  onDescriptionChange,
  onSubmit,
  description,
}: AddMemoryFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo">Photo</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <Button onClick={onSubmit} className="w-full">
        <Camera className="mr-2 h-4 w-4" />
        Sauvegarder
      </Button>
    </div>
  );
};

export default AddMemoryForm;