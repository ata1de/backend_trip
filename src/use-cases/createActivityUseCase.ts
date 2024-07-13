import { ActivityRepository } from "../repository/activity-repositiry";

interface createActivityUseCaseRequest {
    title: string;
    occurs_at: Date;
    tripId: string;
}

export class CreateActivityUseCase {
    constructor(private activityRepository: ActivityRepository) {}

    async execute({title, occurs_at, tripId, }: createActivityUseCaseRequest) {
        const activity = await this.activityRepository.createActivity( title, occurs_at, tripId);

        return { activityId: activity.id };
    }
}