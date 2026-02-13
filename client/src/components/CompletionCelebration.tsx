/* Design Philosophy: Romantic Minimalism
   - Celebration modal with watercolor hearts
   - Soft animations and gentle colors
   - Heartfelt completion message
*/

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface CompletionCelebrationProps {
  open: boolean;
  onClose: () => void;
}

export function CompletionCelebration({ open, onClose }: CompletionCelebrationProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <div className="flex justify-center mb-6">
          <img
            src="https://private-us-east-1.manuscdn.com/sessionFile/GB6KdSJfRnnwat7uo8JxPX/sandbox/H2HOyjG5D4cayTiaSKYrlN_1771003982766_na1fn_Y29tcGxldGlvbi1jZWxlYnJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR0I2S2RTSmZSbm53YXQ3dW84SnhQWC9zYW5kYm94L0gySE95akc1RDRjYXlUaWFTS1lybE5fMTc3MTAwMzk4Mjc2Nl9uYTFmbl9ZMjl0Y0d4bGRHbHZiaTFqWld4bFluSmhkR2x2YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=M3vajYG7FVkyEF6bGTrAUmgUmEFtgUgdzXag7PKz7exhYmTnab2gydT1Ru8zrOoAdHGjfXudbnqZh-vA9M5cRPFBtlkIOVQymYIePb9nCsHsQbS-cRBfLjh8Yc~IvGyfngdii-QAAYw--DhWOEUZ92KAMStb8f8hjIYYxpuEpAFPw0Sui-nVbXVzeZSl3NNvPGNdyrP6FpDUAvuNHp~ovPSILXTRDheytR8o2lgxBKnZe~u-cgesgsegahOy7cpaHCrny1fpgC5syjBLAbStBLiCvyMctOOrHj11seUHA53RfHoaoxPPdaPgFjovL1hmDyViWDs52dR-FgnlpIyPjQ__"
            alt="Celebration"
            className="w-48 h-48 object-contain animate-fade-up"
          />
        </div>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-2 flex items-center justify-center gap-2">
            <Heart className="w-8 h-8 fill-primary text-primary animate-heart-pulse" />
            Journey Complete
            <Heart className="w-8 h-8 fill-primary text-primary animate-heart-pulse" />
          </DialogTitle>
          <DialogDescription className="text-center text-base space-y-4">
            <p>
              You've completed all the questions in this Valentine's Day connection challenge.
            </p>
            <p className="text-foreground font-medium italic">
              "Distance means so little when someone means so much."
            </p>
            <p>
              Today, you've shared thoughts, dreams, and feelings that bring you closer together.
              Every answer is a thread in the beautiful tapestry of your connection.
            </p>
            <p className="text-sm text-muted-foreground">
              You can always come back to review or edit your answers.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button onClick={onClose} size="lg" className="px-8">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
