import { Temporal } from "temporal-polyfill";

export const formatDate = (instantStr: string): string => {
    let temporalInstant = Temporal.Instant.from(instantStr);
    return temporalInstant.toLocaleString('de-de', { timeStyle: 'short', dateStyle: 'medium' });
};
