type UnauthorizedHandler = () => void;

let cloudUnauthorizedHandler: UnauthorizedHandler | null = null;

export function setCloudUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  cloudUnauthorizedHandler = handler;
}

export function notifyCloudUnauthorized(): void {
  cloudUnauthorizedHandler?.();
}
