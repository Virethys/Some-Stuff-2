import { MOODS, Mood } from '@/types/MoodBoardZ';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface MoodFilterProps {
  selectedMoods: Mood[];
  onMoodsChange: (moods: Mood[]) => void;
}

export const MoodFilter = ({ selectedMoods, onMoodsChange }: MoodFilterProps) => {
  const toggleMood = (mood: Mood) => {
    if (selectedMoods.includes(mood)) {
      onMoodsChange(selectedMoods.filter(m => m !== mood));
    } else {
      onMoodsChange([...selectedMoods, mood]);
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        <button
          onClick={() => onMoodsChange([])}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shrink-0",
            selectedMoods.length === 0
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card hover:bg-secondary"
          )}
        >
          All Moods
        </button>
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => toggleMood(mood.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-2 shrink-0",
              selectedMoods.includes(mood.value)
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:bg-secondary"
            )}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: mood.color }}
            />
            {mood.label}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
