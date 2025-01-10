import { operations } from './apiSchema.types';

/**
 * path: '/api/admin/profanity'
 */

/**
 * GetProfanity
 */

export type GetProfanityFilterQuery =
  operations['getProfanityFilters']['parameters']['query'];
export type GetProfanityFilterSuccessResponse =
  operations['getProfanityFilters']['responses'][200]['content']['*/*'];

/**
 * CreateProfanity
 */

export type CreateProfanityFilterRequest = NonNullable<
  operations['createProfanityFilter']['requestBody']
>['content']['application/json'];
export type CreateProfanityFilterSuccessResponse =
  operations['createProfanityFilter']['responses'][200]['content']['*/*'];

/**
 * path: '/api/admin/profanity/{id}'
 * id: number
 */

/**
 * UpdateProfanity
 */

export type UpdateProfanityFilterRequest = NonNullable<
  operations['updateProfanityFilter']['requestBody']
>['content']['application/json'];
export type UpdateProfanityFilterSuccessResponse =
  operations['updateProfanityFilter']['responses'][200]['content']['*/*'];

/**
 * DeleteProfanity
 */

export type DeleteProfanityFilterResponse =
  operations['deleteProfanityFilter']['responses'][200]['content']['*/*'];
