import { Activity } from "@prisma/client";

export interface ActivityRepository {
    createActivity(activityTitle: string, activityOccursAt: Date, tripId: string): Promise<Activity>
}
