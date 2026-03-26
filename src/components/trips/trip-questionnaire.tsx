/**
 * Trip Questionnaire — Multi-Step Form
 *
 * This is the most complex UI component in the MVP.
 * It collects trip details across 5 steps, then submits to create a trip.
 *
 * "use client" because multi-step forms need state to track the current step
 * and accumulate form data across steps.
 *
 * PATTERN: We use react-hook-form for the entire form but show different
 * fields on each step. The form validates only the visible step's fields
 * when you click "Next". On the final step, it submits everything.
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Tent } from "lucide-react";
import { createTrip } from "@/lib/actions/trips";
import { tripSchema, type TripSchemaData } from "@/lib/validations/trip";

const TOTAL_STEPS = 5;

// Labels for display in the review step
const TRIP_TYPE_LABELS: Record<string, string> = {
  car_camping: "Car Camping",
  backpacking: "Backpacking",
  glamping: "Glamping",
  rv: "RV",
  dispersed: "Dispersed Camping",
};

const BIOME_LABELS: Record<string, string> = {
  forest: "Forest",
  desert: "Desert",
  mountain: "Mountain",
  coastal: "Coastal",
  prairie: "Prairie",
  alpine: "Alpine",
};

const VIBE_LABELS: Record<string, string> = {
  relaxing: "Relaxing",
  adventure: "Adventure",
  family: "Family-Friendly",
  romantic: "Romantic",
  social: "Social",
  solo: "Solo Retreat",
};

export function TripQuestionnaire() {
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger, // Manually trigger validation for specific fields
    formState: { errors, isSubmitting },
  } = useForm<TripSchemaData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: "",
      destination: "",
      start_date: "",
      end_date: "",
      party_size: 2,
      trip_type: "car_camping",
      max_travel_time_hours: 3,
      biome: "forest",
      vibe: "relaxing",
      freeform_notes: "",
    },
  });

  // Watch all values for the review step
  const formValues = watch();

  // Fields to validate per step
  const stepFields: Record<number, (keyof TripSchemaData)[]> = {
    1: ["name", "start_date", "end_date"],
    2: ["party_size", "trip_type", "max_travel_time_hours"],
    3: ["biome", "vibe"],
    4: [], // freeform_notes is optional
    5: [], // review step, no new fields
  };

  /** Move to next step after validating current step's fields */
  async function handleNext() {
    const fieldsToValidate = stepFields[step];
    // trigger() validates specific fields and returns true if valid
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  /** Final submit — creates the trip */
  async function onSubmit(data: TripSchemaData) {
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    const result = await createTrip(formData);
    // createTrip redirects on success, so if we get here there's an error
    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="flex items-center gap-2">
            <Tent className="h-5 w-5 text-green-600" />
            Plan Your Trip
          </CardTitle>
          <Badge variant="secondary">
            Step {step} of {TOTAL_STEPS}
          </Badge>
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
      </CardHeader>

      <CardContent>
        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ===== STEP 1: Basic Info ===== */}
          {step === 1 && (
            <div className="grid gap-4">
              <h2 className="text-lg font-semibold">Trip Basics</h2>

              <div className="grid gap-2">
                <Label htmlFor="name">Trip Name</Label>
                <Input
                  id="name"
                  placeholder='e.g., "Summer Weekend at Starved Rock"'
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="destination">Destination (optional)</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Starved Rock State Park, IL"
                  {...register("destination")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register("start_date")}
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red-500">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    {...register("end_date")}
                  />
                  {errors.end_date && (
                    <p className="text-sm text-red-500">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Group & Travel ===== */}
          {step === 2 && (
            <div className="grid gap-4">
              <h2 className="text-lg font-semibold">Group & Travel Details</h2>

              <div className="grid gap-2">
                <Label htmlFor="party_size">Party Size</Label>
                <Input
                  id="party_size"
                  type="number"
                  min={1}
                  max={50}
                  {...register("party_size", { valueAsNumber: true })}
                />
                {errors.party_size && (
                  <p className="text-sm text-red-500">
                    {errors.party_size.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label>Trip Type</Label>
                <RadioGroup
                  value={formValues.trip_type}
                  onValueChange={(value) =>
                    setValue("trip_type", value as TripSchemaData["trip_type"])
                  }
                >
                  {Object.entries(TRIP_TYPE_LABELS).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`trip-${value}`} />
                      <Label htmlFor={`trip-${value}`} className="font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.trip_type && (
                  <p className="text-sm text-red-500">
                    {errors.trip_type.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="max_travel_time_hours">
                  Max Travel Time (hours): {formValues.max_travel_time_hours}
                </Label>
                <input
                  id="max_travel_time_hours"
                  type="range"
                  min={0.5}
                  max={24}
                  step={0.5}
                  className="w-full accent-green-600"
                  {...register("max_travel_time_hours", { valueAsNumber: true })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30 min</span>
                  <span>12 hrs</span>
                  <span>24 hrs</span>
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 3: Preferences ===== */}
          {step === 3 && (
            <div className="grid gap-4">
              <h2 className="text-lg font-semibold">Trip Preferences</h2>

              <div className="grid gap-3">
                <Label>Preferred Biome</Label>
                <RadioGroup
                  value={formValues.biome}
                  onValueChange={(value) =>
                    setValue("biome", value as TripSchemaData["biome"])
                  }
                >
                  {Object.entries(BIOME_LABELS).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`biome-${value}`} />
                      <Label htmlFor={`biome-${value}`} className="font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.biome && (
                  <p className="text-sm text-red-500">
                    {errors.biome.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label>Primary Vibe</Label>
                <RadioGroup
                  value={formValues.vibe}
                  onValueChange={(value) =>
                    setValue("vibe", value as TripSchemaData["vibe"])
                  }
                >
                  {Object.entries(VIBE_LABELS).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`vibe-${value}`} />
                      <Label htmlFor={`vibe-${value}`} className="font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.vibe && (
                  <p className="text-sm text-red-500">
                    {errors.vibe.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ===== STEP 4: Freeform Notes ===== */}
          {step === 4 && (
            <div className="grid gap-4">
              <h2 className="text-lg font-semibold">Anything Else?</h2>
              <p className="text-muted-foreground text-sm">
                Add any specific requests, constraints, or details that will
                help us plan the perfect trip.
              </p>
              <Textarea
                placeholder='e.g., "We have a dog, need pet-friendly campsites. Would love to do a sunrise hike on day 2."'
                rows={5}
                {...register("freeform_notes")}
              />
            </div>
          )}

          {/* ===== STEP 5: Review ===== */}
          {step === 5 && (
            <div className="grid gap-4">
              <h2 className="text-lg font-semibold">Review Your Trip</h2>
              <p className="text-muted-foreground text-sm">
                Review your details, then click &quot;Get Recommendations&quot;
                to see your personalized trip options.
              </p>

              <div className="grid gap-3 rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Trip Name</span>
                  <span className="font-medium">{formValues.name}</span>

                  {formValues.destination && (
                    <>
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-medium">{formValues.destination}</span>
                    </>
                  )}

                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium">
                    {formValues.start_date} to {formValues.end_date}
                  </span>

                  <span className="text-muted-foreground">Party Size</span>
                  <span className="font-medium">
                    {formValues.party_size} {formValues.party_size === 1 ? "person" : "people"}
                  </span>

                  <span className="text-muted-foreground">Trip Type</span>
                  <span className="font-medium">
                    {TRIP_TYPE_LABELS[formValues.trip_type]}
                  </span>

                  <span className="text-muted-foreground">Max Travel</span>
                  <span className="font-medium">
                    {formValues.max_travel_time_hours} hours
                  </span>

                  <span className="text-muted-foreground">Biome</span>
                  <span className="font-medium">
                    {BIOME_LABELS[formValues.biome]}
                  </span>

                  <span className="text-muted-foreground">Vibe</span>
                  <span className="font-medium">
                    {VIBE_LABELS[formValues.vibe]}
                  </span>

                  {formValues.freeform_notes && (
                    <>
                      <span className="text-muted-foreground">Notes</span>
                      <span className="font-medium">
                        {formValues.freeform_notes}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== Navigation Buttons ===== */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div /> // Spacer to keep "Next" on the right
            )}

            {step < TOTAL_STEPS ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating trip..." : "Get Recommendations"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
