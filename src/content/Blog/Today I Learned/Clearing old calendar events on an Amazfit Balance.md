---
created: 2026-10-14T11:18+02:00
changed: 2026-10-20T12:08+02:00
image: https://cdn.shopify.com/s/files/1/0516/8857/1050/files/img_v3_02ft_0ba12e70-e7e9-4741-bbd0-e274e4f9e9cg_1024x1024.jpg?v=1730346501
publish: true
published: 2026-10-20
summary: Removing old calendar events from an Amazfit Balance when deleting the calendar on the phone doesn't clear the watch.
tags:
  - TodayILearned
---
  
I use an Amazfit Balance and had synced my calendar to it through the Zepp app. After leaving my last job, I removed my work calendar from my phone. It disappeared from the phone and Zepp, but my watch still showed the old events and kept reminding me about them, especially recurring weekly events and such. Apparently my wrist hadn't received the memo about my employment status.  
  
Deleting the calendar on the phone wasn't enough. Luckily, I found a workaround that cleared the events without having to reset the whole watch. Here are the steps for my future-self.  
  
## The Fix  
  
First, **revoke Zepp's calendar permission** on the phone:  
  
- **iPhone:** Settings → Apps → Zepp → Calendars → None, or disable calendar access.  
- **Android:** Settings → Apps → Zepp → Permissions → Calendar → Don't allow.  
  
The exact permission labels can vary by OS version and I can't confirm iPhone settings, as I don't use one. The important part is that Zepp can no longer read the phone's calendars.  
  
Then, with the watch connected via Bluetooth, open **Zepp** and select the **Amazfit Balance** under **Device**. Navigate to:  
  
**Device → Device Application Settings → Calendar → Settings** (or the gear icon)  
  
Disable **System Calendar Sync**. If Zepp asks for calendar permission again, deny it for now.  
  
Return to the Zepp home screen and let synchronization finish. Then open the Calendar app on the watch and check that the old events are gone.  
  
**This worked on my Amazfit Balance.** The old work events disappeared after following these steps.  
  
## Keeping Personal Calendar Sync  
  
If I want calendar synchronization again, I can restore Zepp's calendar permission and re-enable **System Calendar Sync** after checking that the stale events are gone.  
  
Before doing that, make sure the unwanted calendar has actually been removed from the phone. Otherwise it could just bring the same events back. After syncing again, check the watch to see which events were imported.  
  
## Reference  
  
- [Balance - How to delete my calendar without resetting the whole watch?](https://www.reddit.com/r/amazfit/comments/1jor30g/balance_how_to_delete_my_calendar_without/)  
- [Calendar sync glitches](https://www.reddit.com/r/amazfit/comments/1fvu9br/calendar_sync_glitches/)  
- [Can't delete events from the GTR 3](https://www.reddit.com/r/amazfit/comments/wupam6/cant_delete_events_from_the_gtr_3/)  
