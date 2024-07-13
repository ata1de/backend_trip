import { prisma } from "../../lib/prisma"
import { ActivityRepository } from "../activity-repositiry"

export class PrismaActivityRepository implements ActivityRepository {
    async createActivity(activityTitle: string, activityOccursAt: Date, tripId: string) {
        const activity = await prisma.activity.create({
            data: {
                title: activityTitle,
                occurs_at: activityOccursAt,
                trip_id: tripId
            }
        })

        return activity
    }
}