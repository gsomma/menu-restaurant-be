import { Logger } from '@nestjs/common';
import { RequestContext } from 'nestjs-request-context';
import {
    EventSubscriber,
    InsertEvent,
    EntitySubscriberInterface,
    UpdateEvent
} from 'typeorm';

@EventSubscriber()
class Subscriber implements EntitySubscriberInterface<any> {

    private readonly logger = new Logger("Subscriber");

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    /**
   * Called before entity insertion.
   */
    beforeInsert(event: InsertEvent<any>): void {
        this.logger.debug('Subscriber/beforeInsert: ' + event.entity);
        if (event.entity) {
            const username = this.getUsername();
            if (username) {
                event.entity.userIns = username;
            }
        }
    }

    beforeUpdate(event: UpdateEvent<any>): void {
        this.logger.debug('Subscriber/beforeUpdste: ' + event.entity);
        if (event.entity) {
            const username = this.getUsername();
            if (username) {
                event.entity.userUpd = username;
            }
        }
    }

    private getUsername() {
        const req = RequestContext.currentContext.req;
        //@ts-ignore
        return req && req.user && req.user.username;
    }
}

export default Subscriber;