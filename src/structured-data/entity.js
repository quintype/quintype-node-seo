import { getSchemaMovieReview } from './schema';

function getMovieEntityTags(movieJson) {
    return getSchemaMovieReview(movieJson);
}

export function generateTagsForEntity(entity, ldJson) {
    if (entity.type && entity.type.toLowerCase() === "movie") {
        return ldJson("Movie", getMovieEntityTags(entity));
    }
}