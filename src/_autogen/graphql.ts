
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export abstract class IQuery {
    abstract puppies(): Puppy[] | Promise<Puppy[]>;
}

export class Puppy {
    id: number;
    name: string;
    age: number;
}

type Nullable<T> = T | null;
