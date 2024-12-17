package be.pxl.services.client;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/notification")
    void sendNotification(@RequestBody NotificationRequest notificationRequest);
}