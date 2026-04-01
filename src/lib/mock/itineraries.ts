/**
 * Mock Itinerary Generator
 *
 * Generates a plausible hour-by-hour itinerary based on the trip dates
 * and selected recommendation. When real AI is added, swap this out.
 */
import { differenceInDays, addDays, format } from "date-fns";
import type { Trip, Recommendation, PreTripTask, DayPlan, DayActivity } from "@/lib/types";

// Simple unique ID generator — used for activities and pre-trip tasks
export function simpleId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Generate pre-trip tasks based on the trip type and party size.
 */
function generatePreTripTasks(trip: Trip): PreTripTask[] {
  const tasks: PreTripTask[] = [
    {
      id: simpleId(),
      task: "Reserve campsite",
      category: "Reservations",
      completed: false,
    },
    {
      id: simpleId(),
      task: "Check weather forecast for trip dates",
      category: "Planning",
      completed: false,
    },
    {
      id: simpleId(),
      task: "Pack sleeping bags and sleeping pads",
      category: "Gear",
      completed: false,
    },
    {
      id: simpleId(),
      task: "Pack tent and ground tarp",
      category: "Gear",
      completed: false,
    },
    {
      id: simpleId(),
      task: "Prepare first aid kit",
      category: "Safety",
      completed: false,
    },
    {
      id: simpleId(),
      task: "Plan meals and pack food/cooler",
      category: "Food",
      completed: false,
    },
    {
      id: simpleId(),
      task: "Charge phones and portable batteries",
      category: "Gear",
      completed: false,
    },
    {
      id: simpleId(),
      task: "Download offline maps for the area",
      category: "Planning",
      completed: false,
    },
  ];

  // Add trip-type specific tasks
  if (trip.trip_type === "backpacking") {
    tasks.push({
      id: simpleId(),
      task: "Pack lightweight stove and fuel",
      category: "Gear",
      completed: false,
    });
    tasks.push({
      id: simpleId(),
      task: "Get bear canister or bear bag",
      category: "Safety",
      completed: false,
    });
  }

  if (trip.party_size && trip.party_size > 4) {
    tasks.push({
      id: simpleId(),
      task: "Confirm headcount and dietary restrictions",
      category: "Planning",
      completed: false,
    });
    tasks.push({
      id: simpleId(),
      task: "Assign shared gear responsibilities",
      category: "Planning",
      completed: false,
    });
  }

  return tasks;
}

/**
 * Generate activities for a single day.
 */
function generateDayActivities(
  dayNumber: number,
  totalDays: number,
  recommendation: Recommendation
): DayActivity[] {
  // First day: travel + setup
  if (dayNumber === 1) {
    return [
      {
        id: simpleId(),
        time: "08:00",
        type: "travel",
        description: `Depart for ${recommendation.name}`,
        location: "Starting location",
        duration_minutes: 180,
      },
      {
        id: simpleId(),
        time: "11:00",
        type: "setup",
        description: "Arrive and set up camp",
        location: recommendation.name,
        duration_minutes: 60,
      },
      {
        id: simpleId(),
        time: "12:00",
        type: "meal",
        description: "Lunch at campsite",
        location: "Campsite",
        duration_minutes: 45,
      },
      {
        id: simpleId(),
        time: "13:00",
        type: "explore",
        description: "Explore the campground area and nearby trails",
        location: recommendation.name,
        duration_minutes: 120,
      },
      {
        id: simpleId(),
        time: "15:00",
        type: "rest",
        description: "Free time — relax, read, swim, or explore",
        location: "Campsite",
        duration_minutes: 120,
      },
      {
        id: simpleId(),
        time: "17:00",
        type: "meal",
        description: "Prepare dinner and campfire cooking",
        location: "Campsite",
        duration_minutes: 90,
      },
      {
        id: simpleId(),
        time: "19:00",
        type: "activity",
        description: "Campfire, stargazing, and s'mores",
        location: "Campsite",
        duration_minutes: 120,
      },
    ];
  }

  // Last day: pack up + travel home
  if (dayNumber === totalDays) {
    return [
      {
        id: simpleId(),
        time: "07:00",
        type: "meal",
        description: "Breakfast at campsite",
        location: "Campsite",
        duration_minutes: 45,
      },
      {
        id: simpleId(),
        time: "08:00",
        type: "setup",
        description: "Break down camp and pack up",
        location: "Campsite",
        duration_minutes: 90,
      },
      {
        id: simpleId(),
        time: "09:30",
        type: "hike",
        description: `Final morning walk — ${recommendation.highlights[0] || "scenic trail"}`,
        location: recommendation.name,
        duration_minutes: 90,
      },
      {
        id: simpleId(),
        time: "11:00",
        type: "meal",
        description: "Quick lunch before departure",
        location: recommendation.location,
        duration_minutes: 45,
      },
      {
        id: simpleId(),
        time: "12:00",
        type: "travel",
        description: "Head home",
        location: recommendation.location,
        duration_minutes: 180,
      },
    ];
  }

  // Middle days: full adventure days
  const highlight =
    recommendation.highlights[dayNumber - 1] ||
    recommendation.highlights[0] ||
    "scenic trail hike";

  return [
    {
      id: simpleId(),
      time: "07:00",
      type: "meal",
      description: "Breakfast at campsite — camp stove cooking",
      location: "Campsite",
      duration_minutes: 45,
    },
    {
      id: simpleId(),
      time: "08:00",
      type: "hike",
      description: `Morning hike: ${highlight}`,
      location: recommendation.name,
      duration_minutes: 180,
    },
    {
      id: simpleId(),
      time: "11:00",
      type: "rest",
      description: "Rest and refuel at camp or trailhead",
      location: "Campsite",
      duration_minutes: 60,
    },
    {
      id: simpleId(),
      time: "12:00",
      type: "meal",
      description: "Lunch — sandwiches and snacks",
      location: "Campsite",
      duration_minutes: 45,
    },
    {
      id: simpleId(),
      time: "13:00",
      type: "activity",
      description:
        dayNumber % 2 === 0
          ? "Afternoon swimming or kayaking"
          : "Explore a new trail or viewpoint",
      location: recommendation.name,
      duration_minutes: 150,
    },
    {
      id: simpleId(),
      time: "15:30",
      type: "rest",
      description: "Free time — hammock, read, take photos",
      location: "Campsite",
      duration_minutes: 90,
    },
    {
      id: simpleId(),
      time: "17:00",
      type: "meal",
      description: "Prepare dinner — grilling or camp cooking",
      location: "Campsite",
      duration_minutes: 90,
    },
    {
      id: simpleId(),
      time: "19:00",
      type: "activity",
      description: "Sunset viewing and campfire",
      location: "Campsite",
      duration_minutes: 120,
    },
  ];
}

/**
 * Generate a complete mock itinerary for a trip.
 */
export function generateMockItinerary(
  trip: Trip,
  recommendation: Recommendation
): { pre_trip_tasks: PreTripTask[]; daily_plan: DayPlan[] } {
  const preTripTasks = generatePreTripTasks(trip);

  // Calculate number of days
  let numDays = 2; // default
  if (trip.start_date && trip.end_date) {
    numDays = Math.max(
      1,
      differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1
    );
  }

  const dailyPlan: DayPlan[] = [];
  for (let day = 1; day <= numDays; day++) {
    const date = trip.start_date
      ? format(addDays(new Date(trip.start_date), day - 1), "yyyy-MM-dd")
      : `Day ${day}`;

    dailyPlan.push({
      day_number: day,
      date,
      activities: generateDayActivities(day, numDays, recommendation),
    });
  }

  return { pre_trip_tasks: preTripTasks, daily_plan: dailyPlan };
}
