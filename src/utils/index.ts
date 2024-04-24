//@ts-nocheck
import { NDKEvent, NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk";

export function encodeBase64Filter(filter: NDKFilter) {
  try {
    return btoa(JSON.stringify(filter));
  } catch {
    return "";
  }
}

export function validateNDKFilter(filter: NDKFilter): NDKFilter {
  for (const key in filter) {
    if (Array.isArray(filter[key]) && filter[key].length === 0) {
      filter[key] = undefined;
    } else {
      if (key === "kinds") {
        const kinds = filter[key];
        if (kinds) {
          filter[key] = kinds.map((val) =>
            typeof val === "number" ? val : parseInt(val, 10)
          ) as number[];
        }
      }
    }
  }

  return filter;
}

export const exportJSON = async (events: NDKEvent[]) => {
  try {
    let eventsToNostr: NostrEvent[] = [];

    await Promise.all(
      events.map(async (event) => {
        eventsToNostr.push(await event.toNostrEvent());
      })
    );

    const jsonString = JSON.stringify(eventsToNostr, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "events.json");

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.log(e);
    console.log("ocurrió un error al exportar");
  }
};
