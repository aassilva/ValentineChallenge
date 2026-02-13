/* Design Philosophy: Romantic Minimalism
   - Floating card with soft glow
   - Two answer fields side by side for bubu and bby
   - Generous padding and breathing room
   - Subtle animations on interaction
*/

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Heart, Check } from "lucide-react";

interface QuestionCardProps {
  id: number;
  timeLabel: string;
  category: string;
  question: string;
  prompt: string;
  isUnlocked: boolean;
  isAnswered: boolean;
  savedAnswerBubu?: string;
  savedAnswerBby?: string;
  onAnswer: (questionId: number, answerBubu: string, answerBby: string) => void;
  position: "left" | "right";
}

export function QuestionCard({
  id,
  timeLabel,
  category,
  question,
  prompt,
  isUnlocked,
  isAnswered,
  savedAnswerBubu,
  savedAnswerBby,
  onAnswer,
  position,
}: QuestionCardProps) {
  const [answerBubu, setAnswerBubu] = useState(savedAnswerBubu || "");
  const [answerBby, setAnswerBby] = useState(savedAnswerBby || "");
  const [isEditing, setIsEditing] = useState(!isAnswered);

  // Update local state when saved answers change (e.g., after loading from database)
  useEffect(() => {
    setAnswerBubu(savedAnswerBubu || "");
    setAnswerBby(savedAnswerBby || "");
  }, [savedAnswerBubu, savedAnswerBby]);

  // Update editing state when isAnswered changes
  useEffect(() => {
    setIsEditing(!isAnswered);
  }, [isAnswered]);

  const handleSave = () => {
    if (answerBubu.trim() || answerBby.trim()) {
      onAnswer(id, answerBubu, answerBby);
      setIsEditing(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div
        className={`flex ${position === "left" ? "justify-start" : "justify-end"} mb-12 animate-fade-up`}
        style={{ animationDelay: `${id * 100}ms` }}
      >
        <Card className="w-full max-w-4xl opacity-50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{timeLabel}</span>
            </div>
            <p className="text-sm text-muted-foreground italic">
              This question will unlock at {timeLabel.toLowerCase()}...
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`flex ${position === "left" ? "justify-start" : "justify-end"} mb-12 animate-fade-up`}
      style={{ animationDelay: `${id * 100}ms` }}
    >
      <Card className={`w-full max-w-4xl soft-glow ${isAnswered ? "bg-card/80" : "bg-card"} backdrop-blur-sm transition-all duration-400`}>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Heart className={`w-5 h-5 ${isAnswered ? "fill-primary text-primary animate-heart-pulse" : "text-primary"}`} />
            <span className="text-sm font-medium text-muted-foreground">{timeLabel}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/30 text-accent-foreground">{category}</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">{question}</h3>
          <p className="text-sm text-muted-foreground italic">{prompt}</p>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bubu's answer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-primary" />
                    bubu's answer
                  </label>
                  <Textarea
                    value={answerBubu}
                    onChange={(e) => setAnswerBubu(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[150px] resize-none text-base"
                  />
                </div>

                {/* Bby's answer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-primary" />
                    bby's answer
                  </label>
                  <Textarea
                    value={answerBby}
                    onChange={(e) => setAnswerBby(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[150px] resize-none text-base"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={!answerBubu.trim() && !answerBby.trim()}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Answers
                </Button>
                {isAnswered && (
                  <Button
                    onClick={() => {
                      setAnswerBubu(savedAnswerBubu || "");
                      setAnswerBby(savedAnswerBby || "");
                      setIsEditing(false);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bubu's saved answer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-primary" />
                    bubu's answer
                  </label>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 min-h-[100px]">
                    <p className="text-base text-foreground whitespace-pre-wrap">
                      {answerBubu || <span className="text-muted-foreground italic">No answer yet</span>}
                    </p>
                  </div>
                </div>

                {/* Bby's saved answer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-primary" />
                    bby's answer
                  </label>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 min-h-[100px]">
                    <p className="text-base text-foreground whitespace-pre-wrap">
                      {answerBby || <span className="text-muted-foreground italic">No answer yet</span>}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full"
              >
                Edit Answers
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
