import { prisma } from "../../lib/prisma"
import { ActivityRepository } from "../activity-repositiry"
import { LinkRepository } from "../link-repository"

export class PrismaLinkRepository implements LinkRepository {
    async createLink(linkTitle: string, linkUrl: string, tripId: string) {
        const link = await prisma.link.create({
            data: {
                title: linkTitle,
                url: linkUrl,
                trip_id: tripId
            }
        })

        return link
    }
}