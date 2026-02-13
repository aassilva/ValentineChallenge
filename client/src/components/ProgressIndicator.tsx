/* Design Philosophy: Romantic Minimalism
   - Vertical timeline with connecting line
   - Hearts that fill as questions are answered
   - Subtle animations for progress
*/

import { Heart } from "lucide-react";

interface ProgressIndicatorProps {
  total: number;
  answered: number;
  unlocked: number;
}

export function ProgressIndicator({ total, answered, unlocked }: ProgressIndicatorProps) {
  const percentage = (answered / total) * 100;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-10">
      <div className="relative h-64 w-1 bg-border rounded-full overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-1000 ease-out"
          style={{ height: `${percentage}%` }}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Heart className="w-6 h-6 fill-primary text-primary animate-heart-pulse" />
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{answered}</p>
          <p className="text-xs text-muted-foreground">of {total}</p>
        </div>
      </div>
    </div>
  );
}
