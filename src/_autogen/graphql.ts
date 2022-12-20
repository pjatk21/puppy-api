
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class App {
    version: string;
}

export abstract class IQuery {
    abstract app(): App | Promise<App>;

    abstract allPuppies(): Puppy[] | Promise<Puppy[]>;

    abstract puppy(id: string): Nullable<Puppy> | Promise<Nullable<Puppy>>;

    abstract puppies(id: string[]): Puppy[] | Promise<Puppy[]>;

    abstract me(): User | Promise<User>;
}

export abstract class ISubscription {
    abstract subscribeTasks(channel: string): ScrapTask | Promise<ScrapTask>;
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

    abstract createChannel(): string | Promise<string>;

    abstract publishTask(id?: Nullable<number>): Nullable<string> | Promise<Nullable<string>>;

    abstract updateLock(locked: boolean): string | Promise<string>;

    abstract oauth2(): OAuth2 | Promise<OAuth2>;

    abstract createPuppy(name: string, age: number): Nullable<Puppy> | Promise<Nullable<Puppy>>;

    abstract processShard(payload: string): boolean | Promise<boolean>;

    abstract setGroups(groups: string[]): string[] | Promise<string[]>;
}

export class ScrapTask {
    id: string;
    name: string;
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

export class User {
    name: string;
    email: string;
    groups: string[];
    scrapers: Scraper[];
}

export type DateTime = any;
type Nullable<T> = T | null;
