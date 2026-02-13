/* Design Philosophy: Romantic Minimalism with Soft Gradients
   - Vertical timeline scroll with floating cards
   - Questions alternate left/right like a conversation
   - Watercolor gradient background that shifts throughout the day
   - Generous whitespace and breathing room
   - Two answer fields for bubu and bby
*/

import { useState, useEffect, useMemo } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { CompletionCelebration } from "@/components/CompletionCelebration";
import { Heart } from "lucide-react";
import questionsData from "../questions-data.json";
import { trpc } from "@/lib/trpc";

interface Question {
  id: number;
  time: string;
  timeLabel: string;
  category: string;
  question: string;
  prompt: string;
}

export default function Home() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch all answers from database
  const { data: answersData = [], refetch } = trpc.answers.getAll.useQuery();
  const upsertAnswerMutation = trpc.answers.upsert.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const questions = questionsData.questions as Question[];

  // Determine which questions are unlocked based on current time
  const unlockedQuestions = useMemo(() => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    return questions.filter((q) => {
      const [hour, minute] = q.time.split(":").map(Number);
      const questionTimeInMinutes = hour * 60 + minute;
      return currentTimeInMinutes >= questionTimeInMinutes;
    });
  }, [currentTime, questions]);

  const answeredCount = answersData.filter(a => a.answerBubu || a.answerBby).length;
  const unlockedCount = unlockedQuestions.length;

  const handleAnswer = async (questionId: number, answerBubu: string, answerBby: string) => {
    await upsertAnswerMutation.mutateAsync({
      questionId,
      answerBubu,
      answerBby,
    });

    // Show celebration if all questions are answered
    if (answeredCount + 1 === questions.length) {
      setTimeout(() => setShowCelebration(true), 500);
    }
  };

  const getAnswer = (questionId: number) => {
    return answersData.find((a) => a.questionId === questionId);
  };

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Hero Section with watercolor background */}
      <div
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/GB6KdSJfRnnwat7uo8JxPX/sandbox/H2HOyjG5D4cayTiaSKYrlN-img-1_1771003982000_na1fn_aGVyby1iYWNrZ3JvdW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR0I2S2RTSmZSbm53YXQ3dW84SnhQWC9zYW5kYm94L0gySE95akc1RDRjYXlUaWFTS1lybE4taW1nLTFfMTc3MTAwMzk4MjAwMF9uYTFmbl9hR1Z5YnkxaVlXTnJaM0p2ZFc1ay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FHLLcM9B7XnmNO4HPQ7BBe~CikTo7CqQtlJFGGMFF6KJzXkf~pSLy~Q3lsebrMz0-EK3PkCTev10UkbWgS3QfOx-jabnvnUh7Oh8bB9jRdCvRVwapITyf2AHgew3Gwo41xhy4ijCjFClWwU3o8iCoD7nXQM1ICABKVhfRB4Myn6CyxUobuOouGgg-MISIOuREey8w4CM7vh3EQEblbDU68dbAN~VgYzS7P2t~vJILjvKFNJRtcxaVYt0V343bhcFuCqsRj5o0qrCEX04pHeh1rDiWcTnVGKSVZFcfYnJxmiXagSUwG6JD8fRTD2d7b-derK8i3p-hrGqESF9tYf1sA__')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="container relative z-10 text-center px-4">
          <div className="flex justify-center mb-6">
            <img
              src="https://private-us-east-1.manuscdn.com/sessionFile/GB6KdSJfRnnwat7uo8JxPX/sandbox/H2HOyjG5D4cayTiaSKYrlN_1771003982766_na1fn_aGVhcnQtaWxsdXN0cmF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR0I2S2RTSmZSbm53YXQ3dW84SnhQWC9zYW5kYm94L0gySE95akc1RDRjYXlUaWFTS1lybE5fMTc3MTAwMzk4Mjc2Nl9uYTFmbl9hR1ZoY25RdGFXeHNkWE4wY21GMGFXOXUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=H9ikW1cj57AUGYEv4~TJky~hCgC97zEmYCyEV2ZNabKGhAt00q42SfQiHNA1LoR3EYv0ii2aqc5xvn6BjDrMueEDWNLOrAB7uuqWQtrcR2xnSwIaBMBfKqssx9X~hlbn37jHTh1VauQNSVwTYQt-elmFAJko1eKyKLgjQfCg-QtM3oih4rfSLmbU4XUNxaj5WiO-eEEK9fbT0XD9eaEO6DO5NgKgrktIFxjFdw2a5763ZMFKoNDTgvJcPd0uexOIu4HjdDCHNWFFwcaucHJ2hNwuHJz3txpMc4xpWjFoOyZPXnHSxx4qW2MZfJWtvwH4Qg3bmUEmUjJk0VmCYrgYLQ__"
              alt="Heart"
              className="w-20 h-20 animate-heart-pulse"
            />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Our Connection Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-light">
            A day of meaningful questions to deepen our bond, one answer at a time.
            New questions unlock throughout the day.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-primary text-primary" />
              <span>{answeredCount} answered</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>{unlockedCount} unlocked</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-muted-foreground" />
              <span>{questions.length} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator - Fixed on left side */}
      <ProgressIndicator
        total={questions.length}
        answered={answeredCount}
        unlocked={unlockedCount}
      />

      {/* Questions Timeline */}
      <div className="container max-w-6xl py-16 px-4">
        {questions.map((question, index) => {
          const isUnlocked = unlockedQuestions.some((q) => q.id === question.id);
          const answer = getAnswer(question.id);
          const isAnswered = !!(answer?.answerBubu || answer?.answerBby);
          const position = index % 2 === 0 ? "left" : "right";

          return (
            <QuestionCard
              key={question.id}
              id={question.id}
              timeLabel={question.timeLabel}
              category={question.category}
              question={question.question}
              prompt={question.prompt}
              isUnlocked={isUnlocked}
              isAnswered={isAnswered}
              savedAnswerBubu={answer?.answerBubu || ""}
              savedAnswerBby={answer?.answerBby || ""}
              onAnswer={handleAnswer}
              position={position}
            />
          );
        })}
      </div>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border/50">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-2">
            Made with love for Valentine's Day
          </p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-primary text-primary animate-heart-pulse" />
            <p className="text-xs text-muted-foreground italic">
              "In every moment shared, love grows deeper"
            </p>
            <Heart className="w-4 h-4 fill-primary text-primary animate-heart-pulse" />
          </div>
        </div>
      </footer>

      {/* Completion Celebration Modal */}
      <CompletionCelebration
        open={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
}
