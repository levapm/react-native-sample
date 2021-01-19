import { get } from "lodash";

export const getFullName = (profile = {}) => {
    const firstName = get(profile, "firstName", "");
    const lastName = get(profile, "lastName", "");

    return `${firstName} ${lastName}`;
};
