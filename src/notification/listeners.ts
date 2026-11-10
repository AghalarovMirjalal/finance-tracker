import * as Notifications from "expo-notifications";
import { router } from "expo-router";

let responseListener: Notifications.EventSubscription | undefined;

export function setupNotificationListeners() {
  responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;

    if (typeof data?.screen === "string") {
      router.push(data.screen as never);
    }
  });
}

export function removeNotificationListeners() {
  responseListener?.remove();
  responseListener = undefined;
}
