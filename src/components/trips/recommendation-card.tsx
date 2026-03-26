/**
 * Recommendation Card
 *
 * Displays a single trip recommendation with match score, highlights, and amenities.
 */
"use client";

import { MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/lib/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number; // 0, 1, 2 — for labeling A, B, C
  onSelect: (recommendation: Recommendation) => void;
  isSelecting: boolean;
}

/** Get the color for the match score badge */
function getScoreColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

const LABELS = ["A", "B", "C"];

export function RecommendationCard({
  recommendation,
  index,
  onSelect,
  isSelecting,
}: RecommendationCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {/* Match score badge in top-right */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={getScoreColor(recommendation.match_score)}>
          <Star className="mr-1 h-3 w-3" />
          {recommendation.match_score}% match
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="text-lg font-bold px-3 py-1">
            {LABELS[index]}
          </Badge>
          <div>
            <CardTitle className="text-xl">{recommendation.name}</CardTitle>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {recommendation.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recommendation.estimated_drive_time} drive
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          {recommendation.description}
        </p>

        {/* Highlights */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Highlights</h4>
          <ul className="grid gap-1">
            {recommendation.highlights.map((highlight, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-1">
            {recommendation.amenities.map((amenity, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-2"
          onClick={() => onSelect(recommendation)}
          disabled={isSelecting}
        >
          {isSelecting ? "Selecting..." : "Select This Trip"}
        </Button>
      </CardContent>
    </Card>
  );
}
