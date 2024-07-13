import { Link } from "@prisma/client";

export interface LinkRepository {
    createLink(LinkTitle: string, linkUrl: string, tripId: string): Promise<Link>
}
