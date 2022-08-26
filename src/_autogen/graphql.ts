
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TaskState {
    WAITING = "WAITING",
    RUNNING = "RUNNING",
    REJECTED = "REJECTED",
    DONE = "DONE"
}

export enum EventType {
    reservation = "reservation",
    exam = "exam",
    workshop = "workshop",
    lecture = "lecture",
    other = "other"
}

export abstract class ISubscription {
    abstract tasksDispositions(): Nullable<ScrapTask> | Promise<Nullable<ScrapTask>>;
}

export class Scraper {
    id: string;
    alias?: Nullable<string>;
}

export class ScraperToken {
    token: string;
}

export abstract class IMutation {
    abstract createScraper(alias?: Nullable<string>): ScraperToken | Promise<ScraperToken>;

    abstract updateOwnState(scraperId: string, state: string): string | Promise<string>;

    abstract updateTaskState(taskId: string, state: string): string | Promise<string>;

    abstract triggerTask(taskId: string): string | Promise<string>;

    abstract oauth2(): OAuth2 | Promise<OAuth2>;

    abstract createPuppy(name: string, age: number): Nullable<Puppy> | Promise<Nullable<Puppy>>;

    abstract processFragment(html: string): ScheduledEvent | Promise<ScheduledEvent>;

    abstract setGroups(groups: string[]): string[] | Promise<string[]>;
}

export class ScrapTask {
    id: string;
    name: string;
    state: TaskState;
    since: DateTime;
    until: DateTime;
}

export class Session {
    token: string;
    userId: string;
    expiresAfter: DateTime;
}

export class OAuth2 {
    google: Session;
}

export class Puppy {
    id: string;
    name: string;
    age: number;
}

export abstract class IQuery {
    abstract allPuppies(): Puppy[] | Promise<Puppy[]>;

    abstract puppy(id: string): Nullable<Puppy> | Promise<Nullable<Puppy>>;

    abstract puppies(id: string[]): Puppy[] | Promise<Puppy[]>;

    abstract availableGroups(): string[] | Promise<string[]>;

    abstract availableHosts(): string[] | Promise<string[]>;

    abstract allEvents(groups?: Nullable<string[]>, hosts?: Nullable<string[]>, type?: Nullable<EventType>): ScheduledEvent[] | Promise<ScheduledEvent[]>;

    abstract rangeEvents(begin: DateTime, end: DateTime, groups?: Nullable<string[]>, hosts?: Nullable<string[]>, type?: Nullable<EventType>): ScheduledEvent[] | Promise<ScheduledEvent[]>;

    abstract me(): User | Promise<User>;
}

export class ScheduledEvent {
    id: string;
    begin: DateTime;
    end: DateTime;
    title: string;
    code: string;
    groups: string[];
    hosts: string[];
    room: string;
    type: EventType;
}

export class User {
    name: string;
    email: string;
    groups: string[];
    scrapers: Scraper[];
}

export type DateTime = any;
type Nullable<T> = T | null;
