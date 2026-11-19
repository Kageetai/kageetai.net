---
created: 2026-11-19T10:13+01:00
changed: 2026-11-19T11:43+01:00
image: "[Open folders in WebStorm from Finder-1795080202735.webp](./attachments/Open%20folders%20in%20WebStorm%20from%20Finder-1795080202735.webp)"
publish: true
published: 2026-11-19
summary: Adding a Finder Quick Action for WebStorm and remembering where macOS keeps the workflow.
tags:
  - TodayILearned
---
I wanted to right-click a project folder in *Finder* on macOS and open it in *WebStorm*, e.g., quickly opening my last project again. The native *Automator* has a built-in action for this, so there is no shell script or extra app to maintain.  
  
## Create the Quick Action  
  
1. Open *Automator* and choose "File → New → Quick Action".  
2. Set "Workflow receives current" to "folders", "in Finder".  
3. Find "Open Finder Items" in the action library and drag it into the workflow.  
4. Set "Open with" to "Other…" and choose *WebStorm* from Applications.  
5. Save as "Open Folder in WebStorm".  
  
It should look something like this:  
  
![](./attachments/Open%20folders%20in%20WebStorm%20from%20Finder-1795080202735.webp)  
  
To use it, right-click a folder and look under *Quick Actions*. This works on a selected folder, but unfortunately not when inside a project folder.  
  
## Where to Find It Again  
  
Automator saves service workflows in where they have to be kept for discovery:  
  
```text  
~/Library/Services/Open Folder in WebStorm.workflow  
```  
  
## If the Menu Item Is Missing  
  
Check **System Settings → Keyboard → Keyboard Shortcuts → Services → Files and Folders** and enable the action if listed. If it is missing, create and save it through *Automator*; copying a generated workflow into *Services* did not make it appear.  
