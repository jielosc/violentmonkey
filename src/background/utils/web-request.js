// Safari doesn't support opt_extraInfoSpec for any webRequest event.
export const canUseWebRequestExtraInfoSpec = () => !__.SAFARI;

export function addWebRequestListener(event, listener, filter, extraInfoSpec) {
  if (canUseWebRequestExtraInfoSpec() && extraInfoSpec?.length) {
    event.addListener(listener, filter, extraInfoSpec);
  } else {
    event.addListener(listener, filter);
  }
}
