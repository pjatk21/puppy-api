
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Puppy {
    id: string;
    name: string;
    age: number;
}

export abstract class IQuery {
    abstract allPuppies(): Puppy[] | Promise<Puppy[]>;

    abstract puppy(id: string): Nullable<Puppy> | Promise<Nullable<Puppy>>;

    abstract puppies(id: string[]): Puppy[] | Promise<Puppy[]>;
}

export abstract class IMutation {
    abstract createPuppy(name: string, age: number): Nullable<Puppy> | Promise<Nullable<Puppy>>;
}

type Nullable<T> = T | null;
