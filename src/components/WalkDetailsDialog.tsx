import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Step {
  title: string;
  description: string;
  duration: string;
}

interface WalkDetailsDialogProps {
  walk: any;
  isOpen: boolean;
  onClose: () => void;
  getImageForWalk: (title: string) => string;
  getStepsForWalk: (title: string) => Step[];
}

const WalkDetailsDialog = ({
  walk,
  isOpen,
  onClose,
  getImageForWalk,
  getStepsForWalk,
}: WalkDetailsDialogProps) => {
  if (!walk) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{walk.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <div 
            className="h-64 w-full bg-cover bg-center rounded-lg mb-6"
            style={{ 
              backgroundImage: `url(${getImageForWalk(walk.title)}?auto=format&fit=crop&w=1200&q=80)`,
            }}
          />
          
          <div className="mt-4">
            <p className="text-gray-600 mb-6">{walk.description}</p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                <span>{walk.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                <span>{walk.difficulty}</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Étapes du parcours</h3>
              {getStepsForWalk(walk.title).map((step, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="text-lg font-medium mb-2">{step.title}</h4>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>{step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalkDetailsDialog;